import { tableSchema } from '@nozbe/watermelondb';

export const financesSchema = tableSchema({
  name: "finances",
  columns: [
    {
      name: "description",
      type: 'string',
    },
    {
      name: "amount",
      type: 'number',
    },
    {
      name: "category",
      type: 'number',
    },
    {
      name: "date",
      type: 'number',
    },
    {
      name: "paymentDate",
      type: 'number',
      isOptional: true,
    },
    {
      name: "paymentStatus",
      type: 'boolean',
    },
    {
      name: "isEnabled",
      type: 'boolean',
    },
  ]
})