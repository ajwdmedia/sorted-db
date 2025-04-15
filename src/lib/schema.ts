type SchemaBase<T, F = false, X = {}> = {
    db: string | null,
    flat: F,
    validate(input: unknown): T,
    safe(input: unknown): [ T, null ] | [ null, Error ],
} & X;

const safety = <T>(z: SchemaBase<T>["validate"]): (input: unknown) => [ T, null ] | [ null, Error ] => {
    return (input: unknown) => {
        try {
            return [ z(input), null ];
        } catch (e) {
            return [ null, e as Error ];
        }
    }
}

export const optional = <T>(params: SchemaBase<T, any>): SchemaBase<T | undefined> => {
    function v(input: unknown) {
        if (input === undefined) return undefined;
        if (input === null) throw new Error("Param is optional, got null")
        try {
            return params.validate(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        db: "",
        flat: params.flat,
        validate: v,
        safe: safety(v),
    }
} 

export const nullable = <T>(params: SchemaBase<T, any>): SchemaBase<T | null> => {
    function v(input: unknown) {
        if (input === undefined) throw new Error("Param is undefined");
        if (input === null) return null;
        try {
            return params.validate(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        db: null,
        flat: params.flat,
        validate: v,
        safe: safety(v),
    }
} 


export const number = (...checks: ((num: number) => true | string)[]): SchemaBase<number, true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "number") throw new Error("Not a Number");
        for (let check of checks) {
            const res = check(input);
            if (typeof res === "string") throw new Error(res);
        }
        return input;
    }
    return {
        db: null,
        flat: true,
        validate: v,
        safe: safety(v),
    }
}

export const string = (...checks: ((str: string) => true | string)[]): SchemaBase<string, true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "string") throw new Error("Not a String");
        for (let check of checks) {
            const res = check(input);
            if (typeof res === "string") throw new Error(res);
        }
        return input;
    }
    return {
        db: "str",
        flat: true,
        validate: v,
        safe: safety(v),
    }
}

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

/**
 * any
 * array - serialise
 * bigint
 * boolean - serialise
 * date
 * effects
 * enum
 * function
 * intersection
 * lazy
 * literal
 * map
 * nan
 * nativeEnum
 * never
 * null
 * nullable
 * number
 * object
 * optional
 * pipeline
 * preprocess
 * promise
 * record
 * set
 * string
 * symbol
 * tuple
 * undefined
 * union
 * unknown
 * void
 */