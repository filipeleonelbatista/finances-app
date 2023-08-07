import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorMode } from "native-base";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, Appearance, DevSettings, ToastAndroid } from "react-native";
import { database } from "../databases";

export const SettingsContext = createContext({});

export function SettingsContextProvider(props) {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();

  const handleToggleTheme = async () => {
    await updateConfiguration(
      "colorModeState",
      colorMode === "light" ? "dark" : "light"
    );
    setColorModeState(colorMode === "light" ? "dark" : "light");
    toggleColorMode();
  };

  const [colorModeState, setColorModeState] = useState(
    Appearance.getColorScheme()
  );
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [isShowLabelOnNavigation, setIsShowLabelOnNavigation] = useState(false);
  const [isEnableTitheCard, setIsEnableTitheCard] = useState(false);
  const [isEnableTotalHistoryCard, setIsEnableTotalHistoryCard] =
    useState(false);
  const [willAddFuelToTransactionList, setWillAddFuelToTransactionList] =
    useState(false);
  const [willUsePrefixToRemoveTihteSum, setWillUsePrefixToRemoveTihteSum] =
    useState(false);
  const [simpleFinancesItem, setSimpleFinancesItem] = useState(false);
  const [marketSimplifiedItems, setMarketSimplifiedItems] = useState(false);
  const [prefixTithe, setPrefixTithe] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [veicleName, setVeicleName] = useState("");
  const [veicleBrand, setVeicleBrand] = useState("");
  const [veicleYear, setVeicleYear] = useState("");
  const [veicleColor, setVeicleColor] = useState("");
  const [veiclePlate, setVeiclePlate] = useState("");
  const [veicleAutonomy, setVeicleAutonomy] = useState(0);
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");

  const handleCleanStorage = async () => {
    Alert.alert(
      "Deseja realmente Eliminar todos os registros?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: "Não",
          style: "cancel",
          onPress: () => console.log("Não pressed"),
        },
        {
          text: "Sim",
          onPress: async () => {
            await database.write(async () => {
              const financesCollection = database.collections.get("finances");
              const allFinances = await financesCollection.query().fetch();
              for (const item of allFinances) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const runsCollection = database.collections.get("runs");
              const allRuns = await runsCollection.query().fetch();
              for (const item of allRuns) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const goalsCollection = database.collections.get("goals");
              const allGoals = await goalsCollection.query().fetch();
              for (const item of allGoals) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const estoqueCollection = database.collections.get("stock");
              const estoqueAll = await estoqueCollection.query().fetch();
              for (const item of estoqueAll) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const listsCollection = database.collections.get("lists");
              const listsAll = await listsCollection.query().fetch();
              for (const item of listsAll) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const itemsCollection = database.collections.get("items");
              const itemsAll = await itemsCollection.query().fetch();
              for (const item of itemsAll) {
                await item.destroyPermanently();
              }
            });

            await database.write(async () => {
              const configsCollection = database.collections.get("config");
              const configsAll = await configsCollection.query().fetch();
              for (const item of configsAll) {
                await item.destroyPermanently();
              }
            });

            await AsyncStorage.clear();

            ToastAndroid.show("Transação Removida", ToastAndroid.SHORT);
            DevSettings.reload();
          },
        },
      ]
    );
  };

  const handleUpdateSelectedFolderToSave = async (text) => {
    setSelectedFolderToSave(text);
    await updateConfiguration("selectedFolderToSave", text);
  };

  const handleUpdateApiKey = async (text) => {
    setApiKey(text);
    await updateConfiguration("apiKey", text);
  };

  const handleSetIsAiEnabled = async (value) => {
    setIsAiEnabled(value);
    await updateConfiguration("isAiEnabled", value ? 1 : 0);
  };

  const handleSetIsShowLabelOnNavigation = async (value) => {
    setIsShowLabelOnNavigation(value);
    await updateConfiguration("isShowLabelOnNavigation", value ? 1 : 0);
  };

  const handleSwitchViewTitheCard = async (value) => {
    setIsEnableTitheCard(value);
    await updateConfiguration("isEnableTitheCard", value ? 1 : 0);
  };

  const handleSetmarketSimplifiedItems = async (value) => {
    setMarketSimplifiedItems(value);
    await updateConfiguration("marketSimplifiedItems", value ? 1 : 0);
  };

  const handleSetSimpleFinancesItem = async (value) => {
    setSimpleFinancesItem(value);
    await updateConfiguration("simpleFinancesItem", value ? 1 : 0);
  };

  const handleSetPrefixTithe = async (value) => {
    setPrefixTithe(value);
    await updateConfiguration("prefixTithe", value);
  };

  const handleToggleWillAddFuel = async (value) => {
    setWillAddFuelToTransactionList(value);
    await updateConfiguration("willAddFuelToTransactionList", value ? 1 : 0);
  };

  const handleWillRemovePrefixToRemove = async (value) => {
    setWillUsePrefixToRemoveTihteSum(value);
    await updateConfiguration("willUsePrefixToRemoveTihteSum", value ? 1 : 0);
  };

  const handleSwitchViewTotalHistoryCard = async (value) => {
    setIsEnableTotalHistoryCard(value);
    await updateConfiguration("isEnableTotalHistoryCard", value ? 1 : 0);
  };

  const handleVeicleName = async (value) => {
    setVeicleName(value);
    await updateConfiguration("veicleName", value);
  };

  const handleVeicleBrand = async (value) => {
    setVeicleBrand(value);
    await updateConfiguration("veicleBrand", value);
  };

  const handleVeicleYear = async (value) => {
    setVeicleYear(value);
    await updateConfiguration("veicleYear", value);
  };

  const handleVeicleColor = async (value) => {
    setVeicleColor(value);
    await updateConfiguration("veicleColor", value);
  };

  const handleVeiclePlate = async (value) => {
    setVeiclePlate(value);
    await updateConfiguration("veiclePlate", value);
  };

  const handleVeicleAutonomy = async (value) => {
    setVeicleAutonomy(value);
    await updateConfiguration("veicleAutonomy", value);
  };

  const updateVeicle = async (veicleInfo) => {
    try {
      const configCollection = database.get("config");
      const response = await configCollection.query().fetch();
      const configItem = response.map((item) => item._raw)[0];

      const itemToUpdate = await database.get("config").find(configItem.id);

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.veicleName = veicleInfo.name;
          data._raw.veicleBrand = veicleInfo.brand;
          data._raw.veicleYear = veicleInfo.year;
          data._raw.veicleColor = veicleInfo.color;
          data._raw.veiclePlate = veicleInfo.plate;
        });
      });
    } catch (error) {
      console.log("updateVeicle error", error);
    }

    ToastAndroid.show("Dados do veiculo atualizados!", ToastAndroid.SHORT);

    loadData();
  };

  const updateConfiguration = async (configVariable, value) => {
    try {
      const configCollection = database.get("config");
      const response = await configCollection.query().fetch();
      const configItem = response.map((item) => item._raw)[0];

      const itemToUpdate = await database.get("config").find(configItem.id);

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw[configVariable] = value;
        });
      });
    } catch (error) {
      console.log("updateConfiguration error", error);
    }

    await AsyncStorage.clear();

    loadData();
  };

  const handleResetConfigs = async () => {
    try {
      const configCollection = database.get("config");
      const response = await configCollection.query().fetch();
      const configItem = response.map((item) => item._raw)[0];

      const itemToUpdate = await database.get("config").find(configItem.id);

      await database.write(async () => {
        await itemToUpdate.destroyPermanently();
      });
    } catch (error) {
      console.log("updateConfiguration error", error);
    }

    loadData();
  };

  const loadData = useCallback(async () => {
    try {
      const configCollection = database.get("config");
      const response = await configCollection.query().fetch();
      const currentList = response.map((item) => item._raw);

      if (currentList.length === 0) {
        try {
          await database.write(async () => {
            await database.get("config").create((data) => {
              data._raw.colorModeState = colorModeState;
              data._raw.isAiEnabled = isAiEnabled ? 1 : 0;
              data._raw.apiKey = apiKey;
              data._raw.isShowLabelOnNavigation = isShowLabelOnNavigation
                ? 1
                : 0;
              data._raw.isEnableTitheCard = isEnableTitheCard ? 1 : 0;
              data._raw.isEnableTotalHistoryCard = isEnableTotalHistoryCard
                ? 1
                : 0;
              data._raw.willAddFuelToTransactionList =
                willAddFuelToTransactionList ? 1 : 0;
              data._raw.willUsePrefixToRemoveTihteSum =
                willUsePrefixToRemoveTihteSum ? 1 : 0;
              data._raw.simpleFinancesItem = simpleFinancesItem ? 1 : 0;
              data._raw.marketSimplifiedItems = marketSimplifiedItems ? 1 : 0;
              data._raw.prefixTithe = prefixTithe;
              data._raw.veicleName = veicleName;
              data._raw.veicleBrand = veicleBrand;
              data._raw.veicleYear = veicleYear;
              data._raw.veicleColor = veicleColor;
              data._raw.veiclePlate = veiclePlate;
              data._raw.veicleAutonomy = veicleAutonomy;
              data._raw.selectedFolderToSave = selectedFolderToSave;
            });
          });
        } catch (error) {
          console.log("create loadData error", error);
        }
      } else {
        setColorModeState(currentList[0].colorModeState);
        setApiKey(currentList[0].apiKey);
        setIsAiEnabled(currentList[0].isAiEnabled === 1);
        setIsShowLabelOnNavigation(
          currentList[0].isShowLabelOnNavigation === 1
        );
        setIsEnableTitheCard(currentList[0].isEnableTitheCard === 1);
        setIsEnableTotalHistoryCard(
          currentList[0].isEnableTotalHistoryCard === 1
        );
        setWillAddFuelToTransactionList(
          currentList[0].willAddFuelToTransactionList === 1
        );
        setWillUsePrefixToRemoveTihteSum(
          currentList[0].willUsePrefixToRemoveTihteSum === 1
        );
        setSimpleFinancesItem(currentList[0].simpleFinancesItem === 1);
        setMarketSimplifiedItems(currentList[0].marketSimplifiedItems === 1);
        setPrefixTithe(currentList[0].prefixTithe);
        setVeicleName(currentList[0].veicleName);
        setVeicleBrand(currentList[0].veicleBrand);
        setVeicleYear(currentList[0].veicleYear);
        setVeicleColor(currentList[0].veicleColor);
        setVeiclePlate(currentList[0].veiclePlate);
        setVeicleAutonomy(currentList[0].veicleAutonomy);
        setSelectedFolderToSave(currentList[0].selectedFolderToSave);
      }
    } catch (error) {
      console.log("loadData error", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SettingsContext.Provider
      value={{
        isEnableTitheCard,
        handleSwitchViewTitheCard,
        willAddFuelToTransactionList,
        handleToggleWillAddFuel,
        willUsePrefixToRemoveTihteSum,
        handleWillRemovePrefixToRemove,
        prefixTithe,
        handleSetPrefixTithe,
        isEnableTotalHistoryCard,
        handleSwitchViewTotalHistoryCard,
        handleCleanStorage,
        simpleFinancesItem,
        setSimpleFinancesItem,
        handleSetSimpleFinancesItem,
        marketSimplifiedItems,
        setMarketSimplifiedItems,
        handleSetmarketSimplifiedItems,
        isShowLabelOnNavigation,
        setIsShowLabelOnNavigation,
        handleSetIsShowLabelOnNavigation,
        handleToggleTheme,
        handleSetIsAiEnabled,
        isAiEnabled,
        apiKey,
        handleUpdateApiKey,
        handleVeicleName,
        handleVeicleBrand,
        handleVeicleYear,
        handleVeicleColor,
        handleVeiclePlate,
        handleVeicleAutonomy,
        veicleAutonomy,
        veicleName,
        veicleBrand,
        veicleYear,
        veicleColor,
        veiclePlate,
        updateVeicle,
        handleUpdateSelectedFolderToSave,
        selectedFolderToSave,
        handleResetConfigs,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
