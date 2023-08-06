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
      name: "desiredQuantity",
      type: "number",
    },
    {
      name: "location",
      type: "string",
    },
    {
      name: "date",
      type: "number",
    },
  ],
});
