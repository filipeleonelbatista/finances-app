import { tableSchema } from "@nozbe/watermelondb";

export const stockSchema = tableSchema({
  name: "stock",
  columns: [
    {
      name: "description",
      type: "string",
    },
    {
      name: "category",
      type: "string",
    },
    {
      name: "amount",
      type: "number",
    },
    {
      name: "quantity",
      type: "number",
    },
    {
      name: "quantityDesired",
      type: "number",
    },
  ],
});
