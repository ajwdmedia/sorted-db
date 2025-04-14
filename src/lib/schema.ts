type SchemaBase<T, F = false, X = {}> = {
    flat: F,
    validate(input: unknown): T,
    safe(input: unknown): [ T, null ] | [ null, Error ],
} & X

const safety = <T>(z: SchemaBase<T>["validate"]): (input: unknown) => [ T, null ] | [ null, Error ] => {
    return (input: unknown) => {
        try {
            return [ z(input), null ]
        } catch (e) {
            return [ null, e as Error ];
        }
    }
}

export const optional = <T>(params: SchemaBase<T, any>): SchemaBase<T | undefined | null> => {
    function v(input: unknown) {
        if (!input) return undefined;
        if (input === null) return null;
        try {
            return params.validate(input);
        } catch (e) {
            throw e;
        }
    }
    return {
        flat: params.flat,
        validate: v,
        safe: safety(v),
    }
} 

export const string = (): SchemaBase<string, true> => {
    function v(input: unknown) {
        if (!input) throw new Error("Object is Falsy");
        if (typeof input !== "string") throw new Error("Not a String");
        return input;
    }
    return {
        flat: true,
        validate: v,
        safe: safety(v),
    }
}

export const object = <T extends {[X: string]: SchemaBase<any, any>}>(params: T): SchemaBase<{[ X in keyof T ]: ReturnType<T[X]["validate"]>}> => {
    function v(input: unknown) {
        if (!input) throw new Error("Object is Falsy");
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