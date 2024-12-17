export type DatabaseDriver<T> = (options: T) => {
    prepare: (table: string) => Promise<void>;
    all:     (table: string) => Promise<{ id: string, value: unknown }[]>;
    get:     (table: string, key: string) => Promise<{ id: string, value: unknown } | null>;
    insert:  (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
    update:  (table: string, key: string, value: any) => Promise<{ id: string, value: unknown }>;
    delete:  (table: string, key: string) => Promise<number>;
    purge:   (table: string) => Promise<number>;
}