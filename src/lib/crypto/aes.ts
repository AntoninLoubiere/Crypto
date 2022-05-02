type AES_TYPE = 'GCM' | 'CTR' | 'CBC';

async function randomAES(type: AES_TYPE = 'GCM') {
    const key = crypto.getRandomValues(new Uint8Array(16));
    const keyEncoded = await crypto.subtle.importKey('raw', key.buffer, 'AES-' + type, true, [
        'encrypt',
        'decrypt',
    ]);

    return {
        key,
        keyEncoded,
    };
}

export async function encryptDataRandomAES(data: Uint8Array, type: AES_TYPE = 'GCM') {
    const { key, keyEncoded } = await randomAES(type);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const params =
        type == 'CBC'
            ? {
                  name: 'AES-CBC',
                  counter: iv,
                  length: 64,
              }
            : {
                  name: 'AES-' + type,
                  iv,
              };
    const cipher = crypto.subtle.encrypt(params, keyEncoded, data);

    return {
        key,
        iv,
        cipher,
    };
}
