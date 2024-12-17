// Reexport your entry components here
import { z, type ZodSchema } from "zod";
import type { DatabaseDriver } from "./types.js"

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

export type StoreOptions = {
    connection: ReturnType<DatabaseDriver<any>>;
    tables: Record<string, ZodSchema>;
}

export const setup = () => {

}