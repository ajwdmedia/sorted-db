// Reexport your entry components here
import type { Configuration, DocumentTableConfig, StructuredTableConfig } from "./types.js"
import type { Handle } from "@sveltejs/kit";

export const sorted = <Tables extends Record<string, StructuredTableConfig<any> | DocumentTableConfig<any>> = {}, Scopes extends string[] = string[]>(config: Configuration<Tables, Scopes>): Handle => {
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