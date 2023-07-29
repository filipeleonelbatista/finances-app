import { appSchema } from '@nozbe/watermelondb';

import { financesSchema } from './financesSchema';

export const schemas = appSchema({
  version: 1,
  tables: [
    financesSchema,
  ]
})