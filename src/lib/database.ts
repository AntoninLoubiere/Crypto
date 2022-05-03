import { browser } from '$app/env';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface DB extends DBSchema {
    cryptoKeys: {
        key: number;
        value: CryptoKeyDB;
    };
}

const DB_VERSION = 1;

let database: IDBPDatabase<DB>;

export async function getDataBase() {
    if (!database && browser) {
        database = await openDB<DB>('crypto-db', DB_VERSION, {
            upgrade(db, originalVersion) {
                if (originalVersion < 1) {
                    db.createObjectStore('cryptoKeys', {
                        keyPath: 'keyId',
                        autoIncrement: true,
                    });
                }
            },
        });
    }
    return database;
}
