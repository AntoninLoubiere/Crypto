import { decryptDataRandomAES, encryptDataRandomAES } from './aes';
import { mergeArraysFlags, splitArraysFlags, verifyKey } from './utils';

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
    ) {
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
            keyId: 2,
        };
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
