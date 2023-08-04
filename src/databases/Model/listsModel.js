import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class ListsModel extends Model {
  static table = "lists";

  @field("description") description;
  @field("location") location;
  @field("quantity") quantity;
  @field("amount") amount;
  @field("date") date;
}

export default ListsModel;
