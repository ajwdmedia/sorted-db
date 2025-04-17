import { type FlatDataTypes, type SchemaBase, safety } from "./base.js";

export const structured = <T extends {id: SchemaBase<string, true>, [X: string]: SchemaBase<any, true>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["check"]>}> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Object is missing");
        if (typeof input !== "object") throw new Error("Not an Object");
        try {
            for (let friend in params) {
                if (!params[friend].flat) throw new Error("Data does not fit structure");
                params[friend].check((input as Record<string, unknown>)[friend]);
            }
        } catch (e) {
            throw new Error("Failed to validate object", { cause: e });
        }
        return input as {[ X in keyof T ]: ReturnType<T[X]["check"]>};
    }

    const keys: Record<string, FlatDataTypes> = {};
    for (let friend in params) {
        if (!params[friend].flat) throw new Error("Data does not fit structure");
        if (!params[friend].db) throw new Error(`Struct contains non-serialisable data (at ${friend})`)
        keys[friend] = params[friend].db;
    }
    
    return {
        db: {
            type: "struct",
            keys,
        },
        flat: false,
        check: v,
        safe: safety(v),
    }
}

export const object = <T extends {[X: string]: SchemaBase<any, any>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["check"]>}> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Object is missing");
        if (typeof input !== "object") throw new Error("Not an Object");
        try {
            for (let friend in params) {
                params[friend].check((input as Record<string, unknown>)[friend]);
            }
        } catch (e) {
            throw new Error("Failed to validate object", { cause: e });
        }
        return input as {[ X in keyof T ]: ReturnType<T[X]["check"]>};
    }

    return {
        db: null,
        flat: false,
        check: v,
        safe: safety(v),
    }
}

export const array = <T extends {[X: string]: SchemaBase<any, any>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["check"]>}> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Object is missing");
        if (typeof input !== "object") throw new Error("Not an Object");
        try {
            for (let friend in params) {
                params[friend].check((input as Record<string, unknown>)[friend]);
            }
        } catch (e) {
            throw new Error("Failed to validate object", { cause: e });
        }
        return input as {[ X in keyof T ]: ReturnType<T[X]["check"]>};
    }

    return {
        db: null,
        flat: false,
        check: v,
        safe: safety(v),
    }
}