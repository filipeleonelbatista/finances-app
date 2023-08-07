import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";
import { useLists } from "../hooks/useLists";
import { usePayments } from "../hooks/usePayments";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import * as DocumentPicker from "expo-document-picker";
import { jsonToCSV, readString } from "react-native-csv";
import { useSettings } from "../hooks/useSettings";

export const MarketContext = createContext({});

export function MarketContextProvider(props) {
  const { addTransaction: addPaymentTransaction } = usePayments();
  const { addTransaction: addListsTransaction, addItemToList } = useLists();
  const { selectedFolderToSave } = useSettings();
  const [MarketList, setMarketList] = useState([]);

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Todos os itens");
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    const filteredCategory = MarketList.filter((item) => {
      if (selectedCategory === "Todos os itens") {
        return true;
      } else {
        return item.category === selectedCategory;
      }
    });

    const filteredWords =
      search === ""
        ? filteredCategory
        : filteredCategory.filter((item) => item.description.includes(search));

    return filteredWords ?? [];
  }, [MarketList, selectedCategory, search]);

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + item.amount * item.quantity;
    }

    return TotalList;
  }, [filteredList]);

  const checkPermissions = async () => {
    try {
      const result = await MediaLibrary.getPermissionsAsync();

      if (!result) {
        const granted = await MediaLibrary.requestPermissionsAsync();

        if (granted === MediaLibrary.PermissionStatus.GRANTED) {
          return true;
        } else {
          Alert.alert("Error", "As permissões não foram concedidas");

          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async function handleCSVtoArrayFormat(data) {
    const [headers, ...rows] = data;
    let newArray = [];

    for (const row of rows) {
      let i = 0;
      let newRowObject = {};
      for (const header of headers) {
        newRowObject[header] = row[i];
        i = i + 1;
      }
      newArray.push(newRowObject);
    }

    if (newArray[newArray.length - 1].description === undefined) {
      newArray.pop();
    }

    return newArray;
  }

  async function handleExportStock() {
    const currentDate = new Date();
    try {
      const CSV = jsonToCSV(MarketList);

      const directoryUri = selectedFolderToSave;

      const fileName = `estoque-${
        currentDate.getDate() < 10
          ? "0" + currentDate.getDate()
          : currentDate.getDate()
      }-${
        currentDate.getMonth() + 1 < 10
          ? "0" + (currentDate.getMonth() + 1)
          : currentDate.getMonth() + 1
      }-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}.csv`;

      const result = await checkPermissions();

      if (result) {
        const createdFile =
          await FileSystem.StorageAccessFramework.createFileAsync(
            directoryUri,
            fileName,
            "text/*"
          );

        const writedFile =
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            createdFile,
            CSV,
            { encoding: "utf8" }
          );

        ToastAndroid.show(
          "Estoque exportados com sucesso para a pasta selecionada",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Houve um problema ao exportar os estoques!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao exportar os estoques!",
        ToastAndroid.SHORT
      );
    }
  }

  async function handleImportStock() {
    try {
      const result = await checkPermissions();
      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: "text/*",
        });
        if (result.type === "success") {
          let fileContent = await FileSystem.readAsStringAsync(result.uri, {
            encoding: "utf8",
          });
          const dataFromCSV = readString(fileContent);
          const csvFormated = await handleCSVtoArrayFormat(dataFromCSV.data);
          if (csvFormated) {
            const importedTransactions = csvFormated.map((item) => {
              const row = {
                description: item.description,
                amount: Number(item.amount),
                category: item.category,
                quantity: Number(item.quantity),
                quantityDesired: Number(item.quantityDesired),
              };

              return row;
            });
            await importTransactions(importedTransactions);
          } else {
            ToastAndroid.show(
              "Houve um problema ao exportar as finanças!",
              ToastAndroid.SHORT
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao importar as finanças!",
        ToastAndroid.SHORT
      );
    }
  }

  async function importTransactions(importedList) {
    for (const importedItem of importedList) {
      try {
        await database.write(async () => {
          await database.get("stock").create((data) => {
            data._raw.description = importedItem.description;
            data._raw.amount = Number(importedItem.amount);
            data._raw.category = importedItem.category;
            data._raw.quantity = Number(importedItem.quantity);
            data._raw.quantityDesired = Number(importedItem.quantityDesired);
          });
        });
      } catch (error) {
        console.log("importTransactions error", error);
      }
    }

    loadTransactions();

    ToastAndroid.show("Importação feita com sucesso", ToastAndroid.SHORT);
  }

  async function handleAddItensOnBuyList(goListsPage) {
    Alert.alert(
      "Adicionar itens do estoque",
      "Deseja adicionar itens do estoque a uma lista de compras?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Somente em falta",
          onPress: async () => {
            const lowestStockList = MarketList.filter(
              (item) => item.quantity < item.quantityDesired
            );

            if (lowestStockList.length > 0) {
              const totalAmount = lowestStockList.reduce((acc, transaction) => {
                return (
                  acc +
                  Number(transaction.amount) * Number(transaction.quantity)
                );
              }, 0);

              const totalQuantity = lowestStockList.reduce(
                (acc, transaction) => {
                  return acc + Number(transaction.quantity);
                },
                0
              );

              const createdList = {
                description: "Em falta no estoque",
                location: "",
                amount: totalAmount,
                quantity: totalQuantity,
                date: new Date(Date.now()).getTime() + 43200000,
              };

              const currentId = await addListsTransaction(createdList);

              if (currentId !== null) {
                for (const item of lowestStockList) {
                  const data = {
                    list_id: currentId,
                    description: item.description,
                    category: item.category,
                    amount: item.amount,
                    quantity: item.quantity,
                    quantityDesired: item.quantityDesired,
                    location: createdList.location,
                    date: createdList.date,
                  };
                  await addItemToList(data);
                }
              }
              goListsPage();
            } else {
              ToastAndroid.show(
                "Nenhum item em falta para criar esta lista",
                ToastAndroid.SHORT
              );
            }
          },
        },
        {
          text: "Todos os itens",
          onPress: async () => {
            if (MarketList.length > 0) {
              const totalAmount = MarketList.reduce((acc, transaction) => {
                return (
                  acc +
                  Number(transaction.amount) * Number(transaction.quantity)
                );
              }, 0);

              const totalQuantity = MarketList.reduce((acc, transaction) => {
                return acc + Number(transaction.quantity);
              }, 0);

              const createdList = {
                description: "Itens do estoque",
                location: "",
                amount: totalAmount,
                quantity: totalQuantity,
                date: new Date(Date.now()).getTime() + 43200000,
              };

              const currentId = await addListsTransaction(createdList);

              if (currentId !== null) {
                for (const item of MarketList) {
                  const data = {
                    list_id: currentId,
                    description: item.description,
                    category: item.category,
                    amount: item.amount,
                    quantity: item.quantity,
                    quantityDesired: item.quantityDesired,
                    location: createdList.location,
                    date: createdList.date,
                  };
                  await addItemToList(data);
                }
              }
              goListsPage();
            } else {
              ToastAndroid.show(
                "Nenhum item para criar esta lista",
                ToastAndroid.SHORT
              );
            }
          },
        },
      ]
    );
  }

  async function handleAddFinances() {
    const data = {
      description: `Compras`,
      amount: listTotal,
      date: new Date(Date.now()).getTime() + 43200000,
      category: "Mercado",
      paymentDate: "",
      paymentStatus: 0,
      isEnabled: 1,
      isFavorited: 0,
    };
    addPaymentTransaction(data);
  }

  async function updateTransaction(currentTransaction) {
    try {
      const itemToUpdate = await database
        .get("stock")
        .find(currentTransaction.id);

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.description = currentTransaction.description;
          data._raw.amount = Number(currentTransaction.amount);
          data._raw.category = currentTransaction.category;
          data._raw.quantity = Number(currentTransaction.quantity);
          data._raw.quantityDesired = Number(
            currentTransaction.quantityDesired
          );
        });
      });
    } catch (error) {
      console.log("updateTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show("Item atualizado com sucesso", ToastAndroid.SHORT);
  }

  async function updateStock(
    currentTransaction,
    isAdd = false,
    isSubtract = false
  ) {
    try {
      const itemToUpdate = await database
        .get("stock")
        .find(currentTransaction.id);

      const currentQuantity = isAdd
        ? Number(currentTransaction.quantity) + 1
        : isSubtract
        ? Number(currentTransaction.quantity) - 1
        : currentTransaction.quantity;

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.description = currentTransaction.description;
          data._raw.amount = Number(currentTransaction.amount);
          data._raw.category = currentTransaction.category;
          data._raw.quantity = Number(currentQuantity);
          data._raw.quantityDesired = Number(
            currentTransaction.quantityDesired
          );
        });
      });
    } catch (error) {
      console.log("updateTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show("Item atualizado com sucesso", ToastAndroid.SHORT);
  }

  async function deleteTransaction(currentTransaction) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
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
            try {
              const itemToDelete = await database
                .get("stock")
                .find(currentTransaction.id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });
            } catch (error) {
              console.log("deleteTransaction error", error);
            }

            loadTransactions();

            ToastAndroid.show("Item removido do carrinho", ToastAndroid.SHORT);
          },
        },
      ]
    );
  }

  async function addTransaction(newTransaction) {
    try {
      await database.write(async () => {
        await database.get("stock").create((data) => {
          data._raw.description = newTransaction.description;
          data._raw.amount = Number(newTransaction.amount);
          data._raw.category = newTransaction.category;
          data._raw.quantity = Number(newTransaction.quantity);
          data._raw.quantityDesired = Number(newTransaction.quantityDesired);
        });
      });
    } catch (error) {
      console.log("addTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show("Item adicionado ao carrinho", ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    try {
      const stockCollection = database.get("stock");
      const response = await stockCollection.query().fetch();
      const currentList = response.map((item) => item._raw);
      setMarketList(currentList);
    } catch (error) {
      setMarketList([]);
    }

    return;
  }, [setMarketList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <MarketContext.Provider
      value={{
        MarketList,
        setMarketList,
        filteredList,
        listTotal,
        selectedCategory,
        setSelectedCategory,
        addTransaction,
        deleteTransaction,
        selectedTransaction,
        setSelectedTransaction,
        updateTransaction,
        handleAddFinances,
        handleImportStock,
        handleExportStock,
        search,
        setSearch,
        updateStock,
        handleAddItensOnBuyList,
        loadTransactions,
      }}
    >
      {props.children}
    </MarketContext.Provider>
  );
}
