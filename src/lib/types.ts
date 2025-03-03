
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

export type Configuration = {
    database: {
        driver: DatabaseDriver<any>,
    },
    auth: {
        methods: AuthMethod[],
        tokens?: {} | false,
        tables?: {
            users: string,
            permissions: string,
        },
        user_data: any,
        id_generator: () => any,
    },
    perms: {
        scopes: [],
        roles: Record<string, string[]>,
    }
}

export type HookMethods = {
    auth: {
        authorize: () => any;
        login: (method: string, requirements: any) => any;
        issueToken: () => any;
        revokeToken: () => any;
        manuallyLogin: () => any;
    },
    perms: {
        hasPermission: () => any;

    }
}