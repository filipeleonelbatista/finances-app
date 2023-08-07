import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

class ConfigModel extends Model {
  static table = "config";

  @field("colorModeState") colorModeState;
  @field("isAiEnabled") isAiEnabled;
  @field("apiKey") apiKey;
  @field("isShowLabelOnNavigation") isShowLabelOnNavigation;
  @field("isEnableTitheCard") isEnableTitheCard;
  @field("isEnableTotalHistoryCard") isEnableTotalHistoryCard;
  @field("willAddFuelToTransactionList") willAddFuelToTransactionList;
  @field("willUsePrefixToRemoveTihteSum") willUsePrefixToRemoveTihteSum;
  @field("simpleFinancesItem") simpleFinancesItem;
  @field("marketSimplifiedItems") marketSimplifiedItems;
  @field("prefixTithe") prefixTithe;
  @field("veicleName") veicleName;
  @field("veicleBrand") veicleBrand;
  @field("veicleYear") veicleYear;
  @field("veicleColor") veicleColor;
  @field("veiclePlate") veiclePlate;
  @field("veicleAutonomy") veicleAutonomy;
  @field("selectedFolderToSave") selectedFolderToSave;
}

export default ConfigModel;
