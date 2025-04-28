import type { DataTypeStructure } from "./schema/base.js";
import type { DocumentTableConfig, StructuredTableConfig } from "./types.js";

export type Condition = any;

export type DatabaseDriver<T> = (options: T) => Promise<{
    introspect: () => Promise<Record<string, DataTypeStructure>>;
    schema:     (tables: Record<string, StructuredTableConfig<any> | DocumentTableConfig<any>>) => Promise<Record<string, DataTypeStructure>>;
    structured: {
        all:        (table: string) => Promise<{ id: string, value: unknown }[]>;
        get:        (table: string, key: string) => Promise<{ id: string, value: unknown } | null>;
        insert:     (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
        update:     (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
        delete:     (table: string, key: string) => Promise<number>;
        where:      (table: string, condition: Condition) => Promise<{id: string, value: unknown}>;
        purge:      (table: string) => Promise<number>;
    },
    document: {
        all:        (table: string) => Promise<{ id: string, value: unknown }[]>;
        get:        (table: string, key: string) => Promise<{ id: string, value: unknown } | null>;
        insert:     (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
        update:     (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
        delete:     (table: string, key: string) => Promise<number>;
        purge:      (table: string) => Promise<number>;
    }
}>

export { driver as betterSqlite3 } from "./drivers/better-sqlite3.js";