import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class ItemsModel extends Model {
  static table = "items";

  @field("list_id") list_id;
  @field("description") description;
  @field("quantity") quantity;
  @field("quantityDesired") quantityDesired;
  @field("amount") amount;
  @field("date") date;
}

export default ItemsModel;
