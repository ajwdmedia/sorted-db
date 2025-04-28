import sqlite3 from "better-sqlite3";
import type { DatabaseDriver } from "../drivers.js";
import { resolve } from "node:path";
export type SQLiteOptions = {
    path: string;
}

export const driver: DatabaseDriver<SQLiteOptions> = async (options) => {
    const database = sqlite3(resolve(options.path));

    return {
        introspect: async () => {
            const prep = database.prepare(`SELECT sql FROM SQLITE_MASTER WHERE type = 'table'`);
            const rows = prep.all() as { sql: string }[];
            for (let { sql } of rows) {
                const start = sql.slice(0, 13);
                if (start !== "CREATE TABLE ") throw new Error("Failed to introspect table");
                const name = sql.slice(13).split(" ")[0];
                const itemstring = sql.slice(15 + name.length, sql.length - 1);
                const items = itemstring.split(", ");
                console.log({ name, items });
            }
        },
        schema: async (tables) => {
            for (let table in tables) {
                if (tables[table].type === "document") {
                    database.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, json TEXT)`);
                }
            }
        },
        document: {
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
    }

};
