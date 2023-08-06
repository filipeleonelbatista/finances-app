import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class ItemsModel extends Model {
  static table = "items";

  @field("list_id") list_id;
  @field("description") description;
  @field("category") category;
  @field("amount") amount;
  @field("quantity") quantity;
  @field("quantityDesired") quantityDesired;
  @field("location") location;
  @field("date") date;
}

export default ItemsModel;
