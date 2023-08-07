import { Q } from "@nozbe/watermelondb";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import * as DocumentPicker from "expo-document-picker";
import { jsonToCSV, readString } from "react-native-csv";
import { useSettings } from "../hooks/useSettings";

export const ListsContext = createContext({});

export function ListsContextProvider(props) {
  const [lists, setLists] = useState([]);
  const { selectedFolderToSave } = useSettings();

  const [selectedCategory, setSelectedCategory] = useState("Todos os itens");

  const [selectedList, setSelectedList] = useState();
  const [selectedListItems, setSelectedListItems] = useState([]);
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    const filteredCategory = selectedListItems.filter((item) => {
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
  }, [selectedListItems, selectedCategory, search]);

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

  async function handleImportList() {
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
                location: item.location,
                date: Number(item.date),
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
    let createdId = null;

    const totalAmount = importedList.reduce((acc, transaction) => {
      return acc + Number(transaction.amount) * Number(transaction.quantity);
    }, 0);

    const totalQuantity = importedList.reduce((acc, transaction) => {
      return acc + transaction.quantity;
    }, 0);

    try {
      await database.write(async () => {
        await database.get("lists").create((data) => {
          createdId = data._raw.id;
          data._raw.description = "Lista importada";
          data._raw.location = "";
          data._raw.amount = totalAmount;
          data._raw.quantity = totalQuantity;
          data._raw.date = new Date(Date.now()).getTime() + 43200000;
        });
      });
    } catch (error) {
      console.log("addTransaction error", error);
    }

    for (const importedItem of importedList) {
      try {
        await database.write(async () => {
          await database.get("items").create((data) => {
            data._raw.list_id = createdId;
            data._raw.description = importedItem.description;
            data._raw.location = importedItem.location;
            data._raw.date = Number(importedItem.date);
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

  async function handleExportList(id) {
    const exportedListInfo = await database.get("lists").find(id);

    const itemsCollection = database.get("items");
    const response = await itemsCollection
      .query(Q.where("list_id", id))
      .fetch();

    const currentList = response.map((item) => item._raw);

    const currentDate = new Date();
    try {
      const CSV = jsonToCSV(currentList);

      const directoryUri = selectedFolderToSave;

      const fileName = `lista-${
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
          "Lista exportada com sucesso para a pasta selecionada",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Houve um problema ao exportar a lista!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao exportar a lista!",
        ToastAndroid.SHORT
      );
    }
  }

  async function updateListInfo(id) {
    const itemToUpdate = await database.get("lists").find(id);

    const itemsCollection = database.get("items");
    const response = await itemsCollection
      .query(Q.where("list_id", id))
      .fetch();

    const currentList = response.map((item) => item._raw);

    const totalAmount = currentList.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    const totalQuantity = currentList.reduce((acc, transaction) => {
      return acc + transaction.quantity;
    }, 0);

    const updatedListInfo = {
      id: id,
      description: itemToUpdate._raw.description,
      location: itemToUpdate._raw.location,
      amount: totalAmount,
      quantity: totalQuantity,
      date: itemToUpdate._raw.date,
    };

    await updateTransaction(updatedListInfo);
  }

  async function handleDeleteList(id, goBack) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: "Não",
          style: "cancel",
          onPress: () => {
            console.log("Não pressed");
          },
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const itemToDelete = await database.get("lists").find(id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });

              await database.write(async () => {
                const itemsCollection = database.collections.get("items");
                const allItemsFromThisList = await itemsCollection
                  .query(Q.where("list_id", id))
                  .fetch();
                for (const item of allItemsFromThisList) {
                  await item.destroyPermanently();
                }
              });

              ToastAndroid.show("Lista excluida", ToastAndroid.SHORT);

              goBack();
            } catch (error) {
              console.log("deleteTransaction error", error);

              ToastAndroid.show("Lista não foi excluida", ToastAndroid.SHORT);
            }

            loadTransactions();
          },
        },
      ]
    );
  }

  async function handleSelectList(id) {
    const itemToUpdate = await database.get("lists").find(id);
    setSelectedList(itemToUpdate._raw);

    try {
      const itemsCollection = database.get("items");
      const response = await itemsCollection
        .query(Q.where("list_id", id))
        .fetch();

      const currentList = response.map((item) => item._raw);

      setSelectedListItems(currentList);
    } catch (error) {
      setSelectedListItems([]);
    }
  }

  async function updateTransaction(currentTransaction) {
    try {
      const itemToUpdate = await database
        .get("lists")
        .find(currentTransaction.id);
      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.description = currentTransaction.description;
          data._raw.location = currentTransaction.location;
          data._raw.amount = currentTransaction.amount;
          data._raw.quantity = currentTransaction.quantity;
          data._raw.date = currentTransaction.date;
        });
      });
    } catch (error) {
      console.log("updateTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show(
      "Informações da lista atualizadas com sucesso",
      ToastAndroid.SHORT
    );
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

  async function deleteItemToList(currentTransaction) {
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
                .get("items")
                .find(currentTransaction.id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });
            } catch (error) {
              console.log("deleteTransaction error", error);
            }

            await updateListInfo(currentTransaction.list_id);

            loadTransactions();

            ToastAndroid.show("Item removido do carrinho", ToastAndroid.SHORT);
          },
        },
      ]
    );
  }

  async function updateItemQuantityToList(
    currentTransaction,
    isAdd = false,
    isSubtract = false
  ) {
    try {
      const itemToUpdate = await database
        .get("items")
        .find(currentTransaction.id);

      const currentQuantity = isAdd
        ? currentTransaction.quantity + 1
        : isSubtract
        ? currentTransaction.quantity - 1
        : currentTransaction.quantityisAdd;

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.list_id = currentTransaction.list_id;
          data._raw.description = currentTransaction.description;
          data._raw.category = currentTransaction.category;
          data._raw.amount = currentTransaction.amount;
          data._raw.quantity = currentQuantity;
          data._raw.quantityDesired = currentTransaction.quantityDesired;
          data._raw.location = currentTransaction.location;
          data._raw.date = currentTransaction.date;
        });
      });
    } catch (error) {
      console.log("updateItemQuantityToList error", error);
    }

    await updateListInfo(currentTransaction.list_id);

    loadTransactions();
  }

  async function updateItemToList(currentTransaction) {
    try {
      const itemToUpdate = await database
        .get("items")
        .find(currentTransaction.id);

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.list_id = currentTransaction.list_id;
          data._raw.description = currentTransaction.description;
          data._raw.category = currentTransaction.category;
          data._raw.amount = currentTransaction.amount;
          data._raw.quantity = currentTransaction.quantity;
          data._raw.quantityDesired = currentTransaction.quantityDesired;
          data._raw.location = currentTransaction.location;
          data._raw.date = currentTransaction.date;
        });
      });
    } catch (error) {
      console.log("updateItemToList error", error);
    }

    await updateListInfo(currentTransaction.list_id);

    loadTransactions();
  }

  async function addItemToList(newTransaction) {
    try {
      await database.write(async () => {
        await database.get("items").create((data) => {
          data._raw.list_id = newTransaction.list_id;
          data._raw.description = newTransaction.description;
          data._raw.category = newTransaction.category;
          data._raw.amount = newTransaction.amount;
          data._raw.quantity = newTransaction.quantity;
          data._raw.quantityDesired = newTransaction.quantityDesired;
          data._raw.location = newTransaction.location;
          data._raw.date = newTransaction.date;
        });
      });
    } catch (error) {
      console.log("addItemToList error", error);
    }

    await updateListInfo(newTransaction.list_id);

    loadTransactions();
  }

  async function addTransaction(newTransaction) {
    let createdId = null;
    try {
      await database.write(async () => {
        await database.get("lists").create((data) => {
          createdId = data._raw.id;
          data._raw.description = newTransaction.description;
          data._raw.location = newTransaction.location;
          data._raw.amount = newTransaction.amount;
          data._raw.quantity = newTransaction.quantity;
          data._raw.date = newTransaction.date;
        });
      });
    } catch (error) {
      console.log("addTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show(
      createdId !== null
        ? "Lista criada com sucesso"
        : "Não foi possível criar a lista",
      ToastAndroid.SHORT
    );
    return createdId;
  }

  const loadTransactions = useCallback(async () => {
    try {
      const listsCollection = database.get("lists");
      const response = await listsCollection.query().fetch();
      const currentList = response.map((item) => item._raw);
      setLists(currentList);
    } catch (error) {
      setLists([]);
    }

    try {
      if (selectedList) {
        await handleSelectList(selectedList.id);
      }
    } catch (error) {
      console.log("error", error);
    }

    return;
  }, [setLists, selectedList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <ListsContext.Provider
      value={{
        lists,
        addTransaction,
        deleteTransaction,
        selectedList,
        setSelectedList,
        updateTransaction,
        addItemToList,
        updateItemToList,
        deleteItemToList,
        handleSelectList,
        handleDeleteList,
        selectedListItems,
        setSelectedListItems,
        listTotal,
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        filteredList,
        updateItemQuantityToList,
        handleExportList,
        loadTransactions,
        handleImportList,
      }}
    >
      {props.children}
    </ListsContext.Provider>
  );
}
