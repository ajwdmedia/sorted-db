import { type SchemaBase, safety } from "./base.js";

export const boolean = (): SchemaBase<boolean, true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "boolean") throw new Error("Not a Number");
        return input;
    }
    return {
        db: {
            type: "boolean",
            nullable: false,
        },
        flat: true,
        check: v,
        safe: safety(v),
    }
}