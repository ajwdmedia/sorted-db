import { sorted } from "$lib/index.js";
import type { Configuration, Infer } from "$lib/types.js";


const config = {
    
} satisfies Configuration;

export type sortedLocals = InferLocals<typeof config>;
export const sortedHandle = sorted(config);