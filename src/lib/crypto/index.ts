import { getDataBase } from '$lib/database';
import { base64DecToArr, base64EncArr } from '$lib/utils';

let currentKey: {
    id: number;
    key: CryptoKeyDB;
};

export async function getKey(keyId: number) {
    if (currentKey?.id == keyId) return currentKey.key;

    const database = await getDataBase();

    let key = await database.get('cryptoKeys', keyId);
    if (!key) {
        console.info('Generate key');
        const cryptoKey = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256',
            },
            true,
            ['encrypt', 'decrypt']
        );
        key = {
            name: 'test',
            password: 'none',
            ...cryptoKey,
        };
        database.put('cryptoKeys', key, keyId);
    }
    currentKey = {
        id: keyId,
        key,
    };
    return key;
}

export async function getEncryptKey(keyId: number) {
    const key = await getKey(keyId);
    return key.publicKey || key.secretKey;
}

export async function getDecodeKey(keyId: number) {
    const key = await getKey(keyId);
    return key.privateKey || key.secretKey;
}

export async function encrypt(text: string, keyId: number): Promise<string> {
    const key = await getEncryptKey(keyId);
    if (!key || !key.usages.includes('encrypt')) {
        return '';
    }
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    const cipher: ArrayBuffer = await crypto.subtle.encrypt(key.algorithm, key, encodedText);
    return base64EncArr(new Uint8Array(cipher));
}

export async function decrypt(cipher: string, keyId: number) {
    const key = await getDecodeKey(keyId);
    if (!key || !key.usages.includes('decrypt')) {
        return '';
    }

    const data = base64DecToArr(cipher);
    const encodedText = await crypto.subtle.decrypt(key.algorithm, key, data);
    const decoder = new TextDecoder();
    return decoder.decode(encodedText);
}
