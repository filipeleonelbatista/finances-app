import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class GoalsModel extends Model {
  static table = "goals";

  @field("description") description;
  @field("currentAmount") currentAmount;
  @field("amount") amount;
  @field("date") date;
}

export default GoalsModel;
