import { type SchemaBase, safety } from "./base.js";

export const object = <T extends {[X: string]: SchemaBase<any, any>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["validate"]>}> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Object is missing");
        if (typeof input !== "object") throw new Error("Not an Object");
        try {
            for (let friend in params) {
                params[friend].validate((input as Record<string, unknown>)[friend]);
            }
        } catch (e) {
            throw new Error("Failed to validate object", { cause: e });
        }
        return input as {[ X in keyof T ]: ReturnType<T[X]["validate"]>};
    }

    return {
        db: null,
        flat: false,
        validate: v,
        safe: safety(v),
    }
}

export const array = <T extends {[X: string]: SchemaBase<any, any>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["validate"]>}> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Object is missing");
        if (typeof input !== "object") throw new Error("Not an Object");
        try {
            for (let friend in params) {
                params[friend].validate((input as Record<string, unknown>)[friend]);
            }
        } catch (e) {
            throw new Error("Failed to validate object", { cause: e });
        }
        return input as {[ X in keyof T ]: ReturnType<T[X]["validate"]>};
    }

    return {
        db: null,
        flat: false,
        validate: v,
        safe: safety(v),
    }
}