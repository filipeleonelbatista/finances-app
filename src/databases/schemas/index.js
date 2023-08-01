import { appSchema } from "@nozbe/watermelondb";

import { financesSchema } from "./financesSchema";
import { runsSchema } from "./runsSchema";

export const schemas = appSchema({
  version: 4,
  tables: [financesSchema, runsSchema],
});
