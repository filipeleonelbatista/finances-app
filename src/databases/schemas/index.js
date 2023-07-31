import { appSchema } from '@nozbe/watermelondb';

import { financesSchema } from './financesSchema';

export const schemas = appSchema({
  version: 3,
  tables: [
    financesSchema,
  ]
})