import { sorted } from "$lib/index.js";
import type { Configuration } from "$lib/types.js";
import { betterSqlite3 } from "$lib/drivers.js";
import { s } from "$lib/schema.js";

const user = s.structured({
    id: s.string({ max: 30 }),
});

const config = {
    db: {
        driver: await betterSqlite3({ path: "~/db.sqlite" }),
        tables: {

        }
    },
    perms: {
        scopes: [ "VIEW", "EDIT", "ADMIN" ]
    }
} satisfies Configuration;

// export type sortedLocals = InferLocals<typeof config>;
export const sortedHandle = sorted(config);