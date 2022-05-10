import { base64EncArr } from '$lib/utils';
import { decryptDataRandomAES, encryptDataRandomAES } from './aes';
import {
    CryptoError,
    decodePEMAndSPKIFormats,
    mergeArraysFlags,
    PEM_END_BEACON,
    PEM_START_BEACON,
    SPKI_END_BEACON,
    SPKI_START_BEACON,
    splitArraysFlags,
    verifyKey,
} from './utils';

const methods: CryptoMethods = {
    async encrypt(
        key: CryptoKeyDB,
        encodedText: Uint8Array,
        options?: {
            useSubEncrypt?: boolean;
            subEncrypt?: Algorithm | AesCtrParams | AesCbcParams | AesGcmParams;
        }
    ) {
        const cryptoKey = verifyKey(key.publicKey, 'encrypt', 'RSA-OAEP');

        if (options?.useSubEncrypt == undefined) {
            if (!options) options = {};
            options.useSubEncrypt = !!options.subEncrypt || encodedText.length > 32;
        }

        if (options.useSubEncrypt) {
            if (!options.subEncrypt) {
                options.subEncrypt = { name: 'AES-GCM' };
            }
            const { key, cipher } = await encryptDataRandomAES(encodedText, options.subEncrypt);
            const encryptedKey: ArrayBuffer = await crypto.subtle.encrypt(
                cryptoKey.algorithm,
                cryptoKey,
                key
            );

            return mergeArraysFlags(1, 1, new Uint8Array(encryptedKey), cipher);
        } else {
            const cipher: ArrayBuffer = await crypto.subtle.encrypt(
                cryptoKey.algorithm,
                cryptoKey,
                encodedText
            );
            return mergeArraysFlags(0, 1, new Uint8Array(cipher));
        }
    },

    async decrypt(key: CryptoKeyDB, cipher: Uint8Array) {
        const cryptoKey = verifyKey(key.privateKey, 'decrypt', 'RSA-OAEP');

        const { flags, arrays } = splitArraysFlags(1, cipher);

        if (flags == 1) {
            const [encryptedKey, data] = arrays;
            const key = new Uint8Array(
                await crypto.subtle.decrypt(cryptoKey.algorithm, cryptoKey, encryptedKey)
            );
            return decryptDataRandomAES(key, data);
        } else {
            const [data] = arrays;
            return new Uint8Array(
                await crypto.subtle.decrypt(cryptoKey.algorithm, cryptoKey, data)
            );
        }
    },

    async generateKey(
        name: string,
        options?: {
            modulus: number;
            hash: string;
            password: 'none' | 'master' | 'unique';
            usages: KeyUsage[];
        }
    ): Promise<CryptoKeyDB> {
        const cryptoKey = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: options?.modulus || 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: options?.hash || 'SHA-256',
            },
            true,
            options?.usages || ['encrypt', 'decrypt']
        );

        return {
            algorithm: 'RSA-OAEP',
            name,
            password: options?.password || 'none',
            privateKey: cryptoKey.privateKey,
            publicKey: cryptoKey.publicKey,
            creationDate: new Date(),
            useDate: new Date(),
        };
    },

    async importKey(
        keys: { key: string; privateKey?: string | undefined },
        name: string,
        options?
    ): Promise<CryptoKeyDB> {
        const algo = {
            name: 'RSA-OAEP',
            modulusLength: options?.modulus || 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: options?.hash || 'SHA-256',
        };

        const cryptoKey = await crypto.subtle.importKey(
            'spki',
            decodePEMAndSPKIFormats('spki', keys.key).buffer,
            algo,
            true,
            options?.usages || ['encrypt']
        );

        let privateKey: CryptoKey | undefined;
        if (keys.privateKey && keys.privateKey.length) {
            privateKey = await crypto.subtle.importKey(
                'pkcs8',
                decodePEMAndSPKIFormats('pem', keys.privateKey).buffer,
                algo,
                true,
                options?.usages || ['decrypt']
            );
        }

        return {
            algorithm: 'RSA-OAEP',
            name,
            password: options?.password || 'none',
            publicKey: cryptoKey,
            privateKey,
            creationDate: new Date(),
            useDate: new Date(),
        };
    },

    async exportKey(key: CryptoKey): Promise<string> {
        if (key.type == 'public') {
            const keyExported = await crypto.subtle.exportKey('spki', key);
            return SPKI_START_BEACON + base64EncArr(new Uint8Array(keyExported)) + SPKI_END_BEACON;
        } else if (key.type == 'private') {
            const keyExported = await crypto.subtle.exportKey('pkcs8', key);
            return PEM_START_BEACON + base64EncArr(new Uint8Array(keyExported)) + PEM_END_BEACON;
        }
        throw new CryptoError('wrong_key', "This algorithm doesn't support this key type.", 'RSA');
    },

    isCompatible(key: CryptoKeyDB, usage: KeyUsage) {
        switch (usage) {
            case 'encrypt':
            case 'verify':
            case 'wrapKey':
                return key.publicKey?.usages.includes(usage) ?? false;

            case 'sign':
            case 'decrypt':
            case 'unwrapKey':
                return key.privateKey?.usages.includes(usage) ?? false;

            default:
                return false;
        }
    },
};

export default methods;
