import { tableSchema } from "@nozbe/watermelondb";

export const configSchema = tableSchema({
  name: "config",
  columns: [
    {
      name: "colorModeState",
      type: "string",
    },
    {
      name: "isAiEnabled",
      type: "number",
    },
    {
      name: "apiKey",
      type: "string",
    },
    {
      name: "isShowLabelOnNavigation",
      type: "number",
    },
    {
      name: "isEnableTitheCard",
      type: "number",
    },
    {
      name: "isEnableTotalHistoryCard",
      type: "number",
    },
    {
      name: "willAddFuelToTransactionList",
      type: "number",
    },
    {
      name: "willUsePrefixToRemoveTihteSum",
      type: "number",
    },
    {
      name: "simpleFinancesItem",
      type: "number",
    },
    {
      name: "marketSimplifiedItems",
      type: "number",
    },
    {
      name: "prefixTithe",
      type: "string",
    },
    {
      name: "veicleName",
      type: "string",
    },
    {
      name: "veicleBrand",
      type: "string",
    },
    {
      name: "veicleYear",
      type: "string",
    },
    {
      name: "veicleColor",
      type: "string",
    },
    {
      name: "veiclePlate",
      type: "string",
    },
    {
      name: "veicleAutonomy",
      type: "number",
    },
  ],
});
