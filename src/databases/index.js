import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import FinancesModel from "./Model/financesModel";
import GoalsModel from "./Model/goalsModel";
import RunsModel from "./Model/runsModel";

import { schemas } from "./schemas";

const adapter = new SQLiteAdapter({
  schema: schemas,
});

export const database = new Database({
  adapter,
  modelClasses: [FinancesModel, RunsModel, GoalsModel],
});
