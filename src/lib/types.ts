import type { DatabaseDriver } from "./drivers.js";
import type { SchemaBase } from "./schema.js";

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

export type Configuration<Tables extends Record<string, StructuredTableConfig<any> | DocumentTableConfig<any>> = {}, Scopes extends string[] = string[]> = {
    db?: {
        driver: Awaited<ReturnType<DatabaseDriver<any>>>,
        tables: Tables,
    },
    perms?: {
        scopes: Scopes,
    }
}

export type Locals = {
    auth: {
        session: () => any;
        user: () => any;
        issueToken: () => any;
        revokeToken: () => any;
        manuallyLogin: (user: string) => any;
    },
    perms: {
        hasPermission: () => any;
        editPermissions: () => any;
    }
}