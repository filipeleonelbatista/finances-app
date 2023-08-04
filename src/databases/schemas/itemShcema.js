import { tableSchema } from "@nozbe/watermelondb";

export const itemsSchema = tableSchema({
  name: "items",
  columns: [
    {
      name: "list_id",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "quantity",
      type: "number",
    },
    {
      name: "amount",
      type: "number",
    },
    {
      name: "date",
      type: "number",
    },
    {
      name: "desiredQuantity",
      type: "number",
    },
  ],
});
