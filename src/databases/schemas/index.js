import { appSchema } from "@nozbe/watermelondb";
import { configSchema } from "./configSchema";

import { financesSchema } from "./financesSchema";
import { goalsSchema } from "./goalsSchema";
import { itemsSchema } from "./itemShcema";
import { listsSchema } from "./listsSchema";
import { runsSchema } from "./runsSchema";
import { stockSchema } from "./stockScheme";

export const schemas = appSchema({
  version: 21,
  tables: [
    financesSchema,
    runsSchema,
    goalsSchema,
    stockSchema,
    listsSchema,
    itemsSchema,
    configSchema
  ],
});
