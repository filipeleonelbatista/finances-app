import { tableSchema } from "@nozbe/watermelondb";

export const goalsSchema = tableSchema({
  name: "goals",
  columns: [
    {
      name: "description",
      type: "string",
    },
    {
      name: "currentAmount",
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
