import type { SchemaBase } from "./schema/base.js";

import { boolean } from "./schema/boolean.js";
import { maybe, optional, nullable } from "./schema/modifiers.js";
import { number } from "./schema/number.js";
import { object, array, structured } from "./schema/object.js";
import { string, enum as enumurator } from "./schema/string.js";

export const s = { boolean, maybe, optional, nullable, number, object, array, structured, string, enum: enumurator };
export default s;

export {
    boolean,
    maybe,
    optional,
    nullable,
    number,
    object,
    array,
    string,
    structured,
    enumurator as enum,
    type SchemaBase
}
