import { tableSchema } from "@nozbe/watermelondb";

export const listsSchema = tableSchema({
  name: "lists",
  columns: [
    {
      name: "description",
      type: "string",
    },
    {
      name: "location",
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
  ],
});
