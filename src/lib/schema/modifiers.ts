import { type SchemaBase, safety } from "./base.js";

export const maybe = <T>(params: SchemaBase<T, any>): SchemaBase<T | undefined | null> => {
    function v(input: unknown) {
        if (input === undefined) return undefined;
        if (input === null) return null;
        try {
            return params.check(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        db: null,
        flat: params.flat,
        check: v,
        safe: safety(v),
    }
} 

export const optional = <T>(params: SchemaBase<T, any>): SchemaBase<T | undefined> => {
    function v(input: unknown) {
        if (input === undefined) return undefined;
        if (input === null) throw new Error("Param is optional, got null")
        try {
            return params.check(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        db: null,
        flat: params.flat,
        check: v,
        safe: safety(v),
    }
} 

export const nullable = <T>(params: SchemaBase<T, any>): SchemaBase<T | null> => {
    function v(input: unknown) {
        if (input === undefined) throw new Error("Param is undefined");
        if (input === null) return null;
        try {
            return params.check(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        db: params.db ? Object.assign({}, params.db, { nullable: true }) : null,
        flat: params.flat,
        check: v,
        safe: safety(v),
    }
} 