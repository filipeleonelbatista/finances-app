import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class FinancesModel extends Model {
  static table = "finances";

  @field("description") description;
  @field("amount") amount;
  @field("category") category;
  @field("date") date;
  @field("paymentDate") paymentDate;
  @field("paymentStatus") paymentStatus;
  @field("isEnable") isEnable;
}

export default FinancesModel;
