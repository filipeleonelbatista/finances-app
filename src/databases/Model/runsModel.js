import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class RunsModel extends Model {
  static table = "runs";

  @field("currentDistance") currentDistance;
  @field("amount") amount;
  @field("unityAmount") unityAmount;
  @field("category") category;
  @field("date") date;
  @field("type") type;
  @field("location") location;
}

export default RunsModel;
