import { tableSchema } from "@nozbe/watermelondb";

export const runsSchema = tableSchema({
  name: "runs",
  columns: [
    {
      name: "currentDistance",
      type: "number",
    },
    {
      name: "unityAmount",
      type: "number",
    },
    {
      name: "amount",
      type: "number",
    },
    {
      name: "type",
      type: "string",
    },
    {
      name: "date",
      type: "number",
    },
    {
      name: "location",
      type: "string",
    },
  ],
});
