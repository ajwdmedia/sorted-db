import type { SchemaBase } from "./schema/index.js";

export type DatabaseDriver<T> = (options: T) => {
    prepare: (table: string) => Promise<void>;
    all:     (table: string) => Promise<{ id: string, value: unknown }[]>;
    get:     (table: string, key: string) => Promise<{ id: string, value: unknown } | null>;
    insert:  (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
    update:  (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
    delete:  (table: string, key: string) => Promise<number>;
    purge:   (table: string) => Promise<number>;
}

export type AuthMethod = {

}

export type StructuredTableConfig<T> = {
    id_generator?: () => string,
    type: "structured",
    schema: SchemaBase<T, true>,
};

export type DocumentTableConfig<T> = {
    id_generator?: () => string,
    type: "document",
    schema: SchemaBase<T, any>,
};

export type Configuration = {
    db?: {
        driver: DatabaseDriver<any>,
        tables: Record<string, Table>,
    },
    auth?: {
        methods: Record<string, AuthMethod>,
        tokens?: {} | false,
        user_data: any,
        id_generator?: () => string,
    },
    perms?: {
        scopes: [],
        roles: Record<string, string[]>,
    }
}

export type Locals = {
    auth: {
        session: () => any;
        user: () => any;
        methods: {}
        issueToken: () => any;
        revokeToken: () => any;
        manuallyLogin: (user: string) => any;
    },
    perms: {
        hasPermission: () => any;
        editPermissions: () => any;
    }
}