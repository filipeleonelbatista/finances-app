import { appSchema } from "@nozbe/watermelondb";

import { financesSchema } from "./financesSchema";
import { goalsSchema } from "./goalsSchema";
import { itemsSchema } from "./itemShcema";
import { listsSchema } from "./listsSchema";
import { runsSchema } from "./runsSchema";
import { stockSchema } from "./stockScheme";

export const schemas = appSchema({
  version: 16,
  tables: [
    financesSchema,
    runsSchema,
    goalsSchema,
    stockSchema,
    listsSchema,
    itemsSchema,
  ],
});
