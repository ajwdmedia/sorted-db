import { type SchemaBase, safety } from "./base.js";

const numberBuilder = (...checks: ((num: number) => true | string)[]): SchemaBase<number, true> => {
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