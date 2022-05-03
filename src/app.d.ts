/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    // interface Locals {}
    // interface Platform {}
    // interface Session {}
    // interface Stuff {}
}

interface CryptoKeyDB {
    name: string;
    publicKey?: CryptoKey;
    privateKey?: CryptoKey;
    secretKey?: CryptoKey;
    password: 'none' | 'master' | 'unique';
    keyId?: number;
}
