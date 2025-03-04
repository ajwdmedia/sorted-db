// Reexport your entry components here
import { z, type ZodSchema, type infer } from "zod";
import type { Configuration, DatabaseDriver } from "./types.js"
import type { Handle } from "@sveltejs/kit";

const t = {
    array: z.array,
    object: z.object,
    string: z.string,
    number: z.number,
    bigint: z.bigint,
    boolean: z.boolean,
    date: z.date,
    undefined: z.undefined,
    null: z.null,
    void: z.void,
    any: z.any,
    unknown: z.unknown,
    never: z.never,
    nan: z.nan,
    enum: z.enum,
    nativeEnum: z.nativeEnum,
    optional: z.optional,
    nullable: z.nullable,
    tuple: z.tuple,
    union: z.union,
    literal: z.literal,
    discriminatedUnion: z.discriminatedUnion,
    record: z.record,
    intersection: z.intersection,
    custom: z.custom,
}

export { t as z };
export type { infer };

export type StoreOptions<Tables extends Record<string, ZodSchema>> = {
    connection: ReturnType<DatabaseDriver<any>>;
    tables: Tables;
}

type Unwrap<T, E> = [ T, null ] | [ null, E ];
type PromiseUnwrap<T, E> = Promise<Unwrap<T, E>>;


export type Store<T extends ZodSchema> = {
    // Gets all items
    all:    () => PromiseUnwrap<z.infer<T>[], "E">,
    // Gets one item
    get:    (key: string) => PromiseUnwrap<z.infer<T>, "E">,
    // Inserts value into DB. "Safe" AKA will error if value already exists
    insert: (key: string, value: z.infer<T>) => PromiseUnwrap<z.infer<T>, "E">,
    // Inserts value into DB. "Unsafe" AKA will just overwrite if value exists
    insertUnsafe: (key: string, value: z.infer<T>) => PromiseUnwrap<z.infer<T>, "E">,
    // Updates value in DB. "Safe" AKA will error if value doesn't exist
    update: (key: string, value: z.infer<T>) => PromiseUnwrap<z.infer<T>, "E">,
    // Updates value in DB. "Unsafe" AKA will update nothing if it doesn't exist.
    updateUnsafe: (key: string, value: z.infer<T>) => PromiseUnwrap<z.infer<T>, "E">,
    // Mutate method solves problems above, you will either get a value or not, and either return value to update or throw error - will be passed.
    mutate: (key: string, updater: (prev: z.infer<T> | null) => z.infer<T>) => PromiseUnwrap<z.infer<T>, "E">,
    // Deletes item by key. Will return item as it is deleted. Will error if not found
    delete: (key: string) => PromiseUnwrap<z.infer<T>, "E">,
    // Deleted item by key. Will not return item, but will tell you if it did exist.
    trash: (key: string) => PromiseUnwrap<boolean, "E">,
    // Clears DB.
    purge:  () => PromiseUnwrap<true, "E">,
}

const store = <T extends ZodSchema>(connection: ReturnType<DatabaseDriver<any>>, table: string, schema: T): Store<T> => {
    connection.prepare(table);
    return {
        all: async () => {
            try {
                const work = await connection.all(table);
                return [ work.map(v => {
                    try {
                        return schema.parse(v);
                    } catch (e) {
                        return null;
                    }
                }).filter(v => !!v), null ];
            } catch (e) {
                return [ null, "E" ];
            }
        },
        get: async (key) => {
            try {
                const work = await connection.get(table, key);
                try {
                    return schema.parse(work);
                } catch (e) {
                    return [ null, "E" ];
                }
            } catch (e) {
                return [ null, "E" ];
            }
        }
    }
}

export const setup = <X = any>(options: {
    connection: ReturnType<DatabaseDriver<any>>;
    tables: X extends { [ T in keyof infer Tables ]: ZodSchema } ? {[ T in keyof Tables ]: Tables[T]} : never
    }) => {
    

    const items = Object.keys(options.tables) as (keyof typeof options.tables)[];
    const dbs: { [] } = {};

    for (let table of items) {
        dbs[table] = store<any>(options.connection, table as string, options.tables[table]);
    }

    return dbs;
}

export const sorted = (config: Configuration): Handle => {
    const auth = {};
    const perms = {};
    const db = {};


    return async ({ event, resolve }) => {
        event.locals.auth = auth;
        event.locals.perms = perms;
        event.locals.db = db;
        return resolve(event);
    }
}