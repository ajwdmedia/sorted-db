import { type SchemaBase, safety } from "./base.js";

export type StringValidator = {
    min?: number,
    max?: number,
    regex?: RegExp,
}

export const string = (valid?: StringValidator): SchemaBase<string, true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "string") throw new Error("Not a String");
        if (!valid) return input;
        if ("min" in valid && typeof valid.min === "number" && input.length < valid.min) throw new Error("String is too short");
        if ("max" in valid && typeof valid.max === "number" && input.length > valid.max) throw new Error("String is too long");
        if ("regex" in valid && valid.regex instanceof RegExp && !valid.regex.test(input)) throw new Error("String does not match regex");
        return input;
    }
    return {
        db: {
            type: "string",
            nullable: false,
            length: valid?.max ? valid.max : -1,
        },
        flat: true,
        check: v,
        safe: safety(v),
    }
}

const enumurator = <T extends string[]>(keys: T): SchemaBase<T[number], true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "string") throw new Error("Not a String");
        if (!keys.includes(input)) throw new Error("String does not match known key");
        return input;
    }
    return {
        db: {
            type: "string",
            nullable: false,
            length: Math.max(...keys.map(it => it.length)),
        },
        flat: true,
        check: v,
        safe: safety(v),
    }
}

export { enumurator as enum };