import { type SchemaBase, safety } from "./base.js";

export type NumberValidator = {
    type?: "int" | "float",
    min?: number,
    max?: number,
}

export const number = (valid?: NumberValidator): SchemaBase<number, true> => {
    function v(input: unknown) {
        if (input === undefined || input === null) throw new Error("Input is missing");
        if (typeof input !== "number") throw new Error("Not a Number");
        if (!valid) return input;
        if ("min" in valid && typeof valid.min === "number" && input < valid.min) throw new Error("Number is too small");
        if ("max" in valid && typeof valid.max === "number" && input > valid.max) throw new Error("Number is too large");
        if ("type" in valid && valid.type === "int" && Number.isInteger(input)) throw new Error("Number is not int");
        return input;
    }
    return {
        db: valid?.type ? {
            type: valid.type,
            nullable: false,
        } : {
            type: "float",
            nullable: false,
        },
        flat: true,
        check: v,
        safe: safety(v),
    }
}