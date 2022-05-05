import { mergeArrays, splitArrays } from './utils';

async function randomAES(usage: KeyUsage, type: string, keyLength: number) {
    const key = crypto.getRandomValues(new Uint8Array(Math.ceil(keyLength / 8)));
    const keyEncoded = await crypto.subtle.importKey('raw', key.buffer, type, false, [usage]);

    return {
        key,
        keyEncoded,
    };
}

export async function encryptDataRandomAES(
    data: Uint8Array,
    options?: (Algorithm | AesCtrParams | AesCbcParams | AesGcmParams) & { keyLength?: number }
) {
    const { key, keyEncoded } = await randomAES(
        'encrypt',
        options?.name || 'AES-GCM',
        options?.keyLength || 256
    );
    const iv = crypto.getRandomValues(
        new Uint8Array(Math.ceil(options?.keyLength ? options.keyLength / 8 : 32))
    );
    const params =
        options?.name == 'AES-CTR'
            ? {
                  name: 'AES-CTR',
                  counter: iv,
                  length: (options as AesCtrParams)?.length
                      ? (options as AesCtrParams)?.length
                      : 64,
              }
            : {
                  name: options?.name || 'AES-GCM',
                  iv,
              };
    const encryptedText = new Uint8Array(await crypto.subtle.encrypt(params, keyEncoded, data));
    const cipher = mergeArrays(iv, encryptedText);

    // TODO store options

    return {
        key,
        cipher,
    };
}

export async function decryptDataRandomAES(key: Uint8Array, data: Uint8Array) {
    const keyEncoded = await crypto.subtle.importKey('raw', key.buffer, 'AES-GCM', false, [
        'decrypt',
    ]);

    const [iv, cipher] = splitArrays(data);
    return new Uint8Array(
        await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv,
            },
            keyEncoded,
            cipher
        )
    );
}

// TODO
// const methods: CryptoMethods = {
//     encrypt() {

//     }
// };

// export default methods;
