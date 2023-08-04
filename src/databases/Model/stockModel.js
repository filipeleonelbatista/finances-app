import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class StockModel extends Model {
  static table = "stock";

  @field("description") description;
  @field("category") category;
  @field("amount") amount;
  @field("quantity") quantity;
  @field("quantityDesired") quantityDesired;
}

export default StockModel;
