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

export async function encrypt(text: string, key: CryptoKeyDB, options?: unknown): Promise<string> {
    const algo = getAlgorithm(key.algorithm);
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    const cipher = await algo.encrypt(key, encodedText, options);
    registerKeyUse(key);
    return base64EncArr(cipher);
}

export async function decrypt(cipher: string, key: CryptoKeyDB) {
    const algo = getAlgorithm(key.algorithm);
    const decoder = new TextDecoder();

    const encodedText = await algo.decrypt(key, base64DecToArr(cipher));
    registerKeyUse(key);
    return decoder.decode(encodedText);
}

export async function generateKey(algorithm: string, name: string, options?: unknown) {
    const algo = getAlgorithm(algorithm);
    console.info('Generate key');

    const key = await algo.generateKey(name, options);
    (await getDataBase()).add('cryptoKeys', key);

    return key;
}

export function isCompatible(key: CryptoKeyDB, usage: KeyUsage) {
    return getAlgorithm(key.algorithm).isCompatible(key, usage);
}

export function isUsage(usage: string): usage is KeyUsage {
    return KEY_USAGE.includes(usage);
}

async function registerKeyUse(key: CryptoKeyDB) {
    const db = await getDataBase();
    key.useDate = new Date();
    await db.put('cryptoKeys', key);
}

export async function exportKey(key: CryptoKey) {
    return getAlgorithm(key.algorithm.name).exportKey(key);
}

function getAlgorithm(algorithm: string) {
    const algo = ALGORITHMS.get(algorithm);
    if (!algo) {
        throw new CryptoError(
            'algorithm_unknown',
            `The algorithm ${algorithm} is unknown. Only ${Array.from(
                ALGORITHMS.keys()
            )} are valid.`
        );
    }
    return algo;
}
