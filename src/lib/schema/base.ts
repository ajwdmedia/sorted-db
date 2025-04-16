export type SchemaBase<T, F = false> = {
    db: DataType | null,
    flat: F,
    validate(input: unknown): T,
    safe(input: unknown): [ T, null ] | [ null, Error ],
};

export const safety = <T>(z: SchemaBase<T>["validate"]): (input: unknown) => [ T, null ] | [ null, Error ] => {
    return (input: unknown) => {
        try {
            return [ z(input), null ];
        } catch (e) {
            return [ null, e as Error ];
        }
    }
}

export type DataTypeNumber = {
    type: "int" | "float",
}

export type DataTypeString = {
    type: "string",
    length: number,
}

export type DataType = (DataTypeNumber | DataTypeString) & { nullable: boolean,  };