// Reexport your entry components here
import type { Configuration, DocumentTableConfig, StructuredTableConfig } from "./types.js"
import type { Handle } from "@sveltejs/kit";

export const sorted = <Tables extends Record<string, StructuredTableConfig<any> | DocumentTableConfig<any>> = {}, Scopes extends string[] = string[]>(config: Configuration<Tables, Scopes>): Handle => {
    const auth = {};
    const perms = {};
    const db = {};

    
    if (config.db) {
        config.db.driver.introspect();
        config.db.driver.schema(config.db.tables);
        config.db.driver.introspect();
    }

    return async ({ event, resolve }) => {
        event.locals.auth = auth;
        event.locals.perms = perms;
        event.locals.db = db;
        return resolve(event);
    }
}