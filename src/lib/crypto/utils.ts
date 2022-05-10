import { base64DecToArr } from '$lib/utils';

export class CryptoError extends Error {
    constructor(reason: string, message: string, algorithm?: string) {
        super((algorithm ? algorithm + ' - ' : '') + reason + ' - ' + message);
        this.name = 'CryptoError';
    }
}

export const PEM_START_BEACON = '-----BEGIN PRIVATE KEY-----\n';
export const PEM_END_BEACON = '\n-----END PRIVATE KEY-----';
export const SPKI_START_BEACON = '-----BEGIN PUBLIC KEY-----\n';
export const SPKI_END_BEACON = '\n-----END PUBLIC KEY-----';

export function verifyKey(
    key: CryptoKey | undefined,
    usage: KeyUsage,
    algorithm: string
): CryptoKey {
    if (!key) {
        throw new CryptoError(
            'wrong_key',
            `${algorithm} does not support this type of key for ${usage}.`,
            algorithm
        );
    }

    if (key.algorithm.name != algorithm) {
        throw new CryptoError(
            'wrong_key',
            `This key isn't made for ${algorithm} but for ${key.algorithm.name}.`
        );
    }

    if (!key.usages.includes(usage)) {
        throw new CryptoError('wrong_key_usage', `This key does not support ${usage}.`, algorithm);
    }
    return key;
}

export function mergeArraysFlags(flags: number, flagBitsLength: number, ...arrays: Uint8Array[]) {
    const byteLength = Math.ceil(flagBitsLength / 8);
    const flagsArray = [];
    for (let i = 0; i < byteLength; i++) {
        flagsArray.push((flags >> (8 * i)) & 0xff);
    }

    const data = mergeArrays(...arrays);
    const array = new Uint8Array(data.length + byteLength);
    array.set(flagsArray);
    array.set(data, byteLength);
    return array;
}

export function mergeArrays(...arrays: Uint8Array[]) {
    const length = arrays.reduce(
        (count, a) => count + a.length + Math.ceil(numberBits(a.length) / 7),
        0
    );
    const array = new Uint8Array(length);

    let offset = 0;
    for (const a of arrays) {
        let length = a.length;
        const lengthArray = [];
        do {
            let lengthToPush = length & 0x7f; // 0x7f = 0b01111111x
            length >>= 7;
            if (length > 0) {
                lengthToPush |= 0x80; /// 0x80 = 0b10000000
            }
            lengthArray.push(lengthToPush);
        } while (length > 0);

        array.set(lengthArray, offset);
        offset += lengthArray.length;
        array.set(a, offset);
        offset += a.length;
    }
    console.assert(offset == length, 'We should have added the whole length', {
        offset,
        length,
        arrays,
    });

    return array;
}

export function splitArraysFlags(
    flagBitsLength: number,
    data: Uint8Array
): { flags: number; arrays: Uint8Array[] } {
    const byteLength = Math.ceil(flagBitsLength / 8);
    let flags = 0;
    for (let i = 0; i < byteLength; i++) {
        const d = data.at(i);
        if (!d) continue;
        flags |= d << (8 * i);
    }
    const arrays = splitArrays(data.slice(byteLength));

    return {
        flags,
        arrays,
    };
}

export function splitArrays(data: Uint8Array): Uint8Array[] {
    const arrays: Uint8Array[] = [];

    let offset = 0;
    while (offset < data.length) {
        let length = 0;
        let currentLength;
        let i = 0;
        do {
            currentLength = data.at(offset);
            offset += 1;
            if (!currentLength) break;

            length |= (currentLength & 0x7f) << (7 * i++);
        } while ((currentLength & 0x80) == 0x80);

        if (length + offset > data.length) break;
        arrays.push(data.slice(offset, offset + length));
        offset += length;
    }

    if (offset != data.length) {
        throw new CryptoError('malformed_data', 'The data to split is malformed.');
    }

    return arrays;
}

function numberBits(n: number): number {
    if (!n) return 1;
    return Math.floor(Math.log2(n) + 1);
}

export function decodePEMAndSPKIFormats(type: 'pem' | 'spki', data: string) {
    const startBeacon = type == 'pem' ? PEM_START_BEACON.trim() : SPKI_START_BEACON.trim();
    const endBeacon = type == 'pem' ? PEM_END_BEACON.trim() : SPKI_END_BEACON.trim();

    const startIndex = data.search(startBeacon);
    const endIndex = data.search(endBeacon);
    if (startIndex < 0 || endIndex < 0) {
        throw new CryptoError(
            'malformed_data',
            `The key given is malformed and does not meet the requirements of ${type} encoding.`
        );
    }
    return base64DecToArr(data.substring(startIndex + startBeacon.length, endIndex));
}
