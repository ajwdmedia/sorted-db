export type SchemaBase<T, F = false> = {
    db: (F extends true ? FlatDataTypes : DataType) | null,
    flat: F,
    check(input: unknown): T,
    safe(input: unknown): [ T, null ] | [ null, Error ],
};

export const safety = <T>(z: SchemaBase<T>["check"]): (input: unknown) => [ T, null ] | [ null, Error ] => {
    return (input: unknown) => {
        try {
            return [ z(input), null ];
        } catch (e) {
            return [ null, e as Error ];
        }
    }
}

export type DataTypeBoolean = {
    type: "boolean",
    nullable: boolean,
}

export type DataTypeNumber = {
    type: "int" | "float",
    nullable: boolean,
}

export type DataTypeString = {
    type: "string",
    length: number, // -1 = NOT CHECKED
    nullable: boolean,
}

export type DataTypeStructure = {
    type: "struct",
    keys: Record<string, FlatDataTypes>,
}

export type FlatDataTypes = (DataTypeNumber | DataTypeString | DataTypeBoolean)
export type DataType = FlatDataTypes | DataTypeStructure;