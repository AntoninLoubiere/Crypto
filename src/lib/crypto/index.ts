import { getDataBase } from '$lib/database';
import { base64DecToArr, base64EncArr } from '$lib/utils';
import RSA_OAEP from './rsa';
import { CryptoError } from './utils';
// import AES from './aes';

const KEY_USAGE = [
    'decrypt',
    'deriveBits',
    'deriveKey',
    'encrypt',
    'sign',
    'unwrapKey',
    'verify',
    'wrapKey',
];

let currentKey: CryptoKeyDB;

const ALGORITHMS = new Map<string, CryptoMethods>([['RSA-OAEP', RSA_OAEP]]);

export async function getKey(keyId: number) {
    if (currentKey?.keyId == keyId) return currentKey;

    const database = await getDataBase();

    let key = await database.get('cryptoKeys', keyId);
    if (!key) {
        key = await generateKey('RSA-OAEP', 'Test', { keyId });
    }
    currentKey = key;
    return key;
}

export async function encrypt(text: string, keyId: number, options?: unknown): Promise<string> {
    const key = await getKey(keyId);
    if (!key) {
        throw new CryptoError('key_missing', `Unable to get the key ${keyId}`);
    }
    const algo = ALGORITHMS.get(key.algorithm);
    if (!algo) {
        throw new CryptoError(
            'algorithm_unknown',
            `The algorithm ${key.algorithm} is unknown. Only ${Array.from(
                ALGORITHMS.keys()
            )} are valid.`
        );
    }

    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    const cipher = await algo.encrypt(key, encodedText, options);
    return base64EncArr(cipher);
}

export async function decrypt(cipher: string, keyId: number) {
    const key = await getKey(keyId);
    if (!key) {
        throw new CryptoError('key_missing', `Unable to get the key ${keyId}`);
    }
    const algo = ALGORITHMS.get(key.algorithm);
    if (!algo) {
        throw new CryptoError(
            'algorithm_unknown',
            `The algorithm ${key.algorithm} is unknown. Only ${Array.from(
                ALGORITHMS.keys()
            )} are valid.`
        );
    }

    const decoder = new TextDecoder();
    return decoder.decode(await algo.decrypt(key, base64DecToArr(cipher)));
}

export async function generateKey(algorithm: string, name: string, options?: unknown) {
    const algo = ALGORITHMS.get(algorithm);
    if (!algo) {
        throw new CryptoError(
            'algorithm_unknown',
            `The algorithm ${algorithm} is unknown. Only ${Array.from(
                ALGORITHMS.keys()
            )} are valid.`
        );
    }
    console.info('Generate key');

    const key = await algo.generateKey(name, options);
    (await getDataBase()).add('cryptoKeys', key);

    return key;
}

export function isCompatible(key: CryptoKeyDB, usage: KeyUsage) {
    const algo = ALGORITHMS.get(key.algorithm);
    if (!algo) {
        throw new CryptoError(
            'algorithm_unknown',
            `The algorithm ${key.algorithm} is unknown. Only ${Array.from(
                ALGORITHMS.keys()
            )} are valid.`
        );
    }
    return algo.isCompatible(key, usage);
}

export function isUsage(usage: string): usage is KeyUsage {
    return KEY_USAGE.includes(usage);
}
