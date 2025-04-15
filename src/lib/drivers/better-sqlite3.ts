import sqlite3 from "better-sqlite3";
import type { DatabaseDriver } from "$lib/types.js";
export type SQLiteOptions = {
    path: string;
}

export const driver: DatabaseDriver<SQLiteOptions> = (options) => {
    const database = sqlite3(options.path);

    return {
        prepare: async (table) => {
            database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
        },
        all: async (table) => {
            const prep = database.prepare<{ ID: string, json: string }>(`SELECT * FROM ${table}`);
            return prep.all({}).map(row => ({ id: row.ID, value: JSON.parse(row.json) }))
        },
        get: async (table, key) => {
            const value = (await database.prepare(`SELECT json FROM ${table} WHERE ID = @key`).get({key}));
            return value ?? null;
        },
        insert: async (table, key, value) => {
            database.prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`).run(key, JSON.stringify(value));
            return { id: key, value };
        },
        update: async (table, key, value) => {
            database.prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`).run(JSON.stringify(value), key);
            return { id: key, value };
        },
        delete: async (table, key) => {
            const result = database.prepare(`DELETE FROM ${table} WHERE ID=@key`).run({ key });
            return (result.changes as number);
        },
        purge: async (table) => {
            const result = database.prepare(`DELETE FROM ${table}`).run();
            return (result.changes as number);
        }
    }

};
