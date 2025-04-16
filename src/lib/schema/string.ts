import { type SchemaBase, safety } from "./base.js";

const stringBuilder = (...checks: ((str: string) => true | string)[]): SchemaBase<string, true> => {
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