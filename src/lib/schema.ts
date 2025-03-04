type SchemaBase<T> = {
    native: string,
    validate: (value: any) => asserts value is T,
}



export const schema = <T extends SchemaBase>(def: T) => {
    
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