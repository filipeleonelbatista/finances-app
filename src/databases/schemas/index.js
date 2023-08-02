import { appSchema } from "@nozbe/watermelondb";

import { financesSchema } from "./financesSchema";
import { goalsSchema } from "./goalsSchema";
import { runsSchema } from "./runsSchema";

export const schemas = appSchema({
  version: 5,
  tables: [financesSchema, runsSchema, goalsSchema],
});
