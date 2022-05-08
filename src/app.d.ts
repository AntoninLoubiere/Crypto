/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    // interface Locals {}
    // interface Platform {}
    // interface Session {}
    interface Stuff {
        key: CryptoKeyDB;
    }
}

interface CryptoKeyDB {
    name: string;
    algorithm: string;
    publicKey?: CryptoKey;
    privateKey?: CryptoKey;
    secretKey?: CryptoKey;
    password: 'none' | 'master' | 'unique';
    keyId?: number;
    creationDate: Date;
    useDate: Date;
}

interface CryptoMethods {
    exportKey(key: CryptoKey): Promise<string>;
    encrypt(key: CryptoKeyDB, encodedText: Uint8Array, options?): Promise<Uint8Array>;
    decrypt(key: CryptoKeyDB, cipher: Uint8Array): Promise<Uint8Array>;
    generateKey(name: string, options?): Promise<CryptoKeyDB>;
    isCompatible(key: CryptoKeyDB, usage: KeyUsage): boolean;
}

declare namespace Intl {
    class ListFormat {
        public format: (items: ?string[]) => string;
    }
}
