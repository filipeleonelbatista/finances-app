import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const MarketContext = createContext({});

export function MarketContextProvider(props) {
  const { addTransaction: addPaymentTransaction } = usePayments();
  const { addTransaction: addListsTransaction, addItemToList } = useLists();
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

  async function handleAddItensOnBuyList() {
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
                return acc + transaction.amount;
              }, 0);

              const createdList = {
                description: "Em falta no estoque",
                location: "",
                amount: totalAmount,
                quantity: lowestStockList.length,
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
                return acc + transaction.amount;
              }, 0);

              const createdList = {
                description: "Itens do estoque",
                location: "",
                amount: totalAmount,
                quantity: MarketList.length,
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
      description: `Lista Compras`,
      amount: listTotal,
      date: Date.now(),
      category: "Mercado",
      paymentDate: "",
      paymentStatus: false,
      isEnabled: true,
      isFavorited: true,
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
          data._raw.amount = currentTransaction.amount;
          data._raw.category = currentTransaction.category;
          data._raw.quantity = currentTransaction.quantity;
          data._raw.quantityDesired = currentTransaction.quantityDesired;
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
        ? currentTransaction.quantity + 1
        : isSubtract
        ? currentTransaction.quantity - 1
        : currentTransaction.quantityisAdd;

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.description = currentTransaction.description;
          data._raw.amount = currentTransaction.amount;
          data._raw.category = currentTransaction.category;
          data._raw.quantity = currentQuantity;
          data._raw.quantityDesired = currentTransaction.quantityDesired;
        });
      });
    } catch (error) {
      console.log("updateTransaction error", error);
    }

    loadTransactions();

    ToastAndroid.show("Item atualizado com sucesso", ToastAndroid.SHORT);
  }

  async function importMarket(importedList) {
    const newTransactionList = [...MarketList, ...importedList];

    await AsyncStorage.setItem("market", JSON.stringify(newTransactionList));

    loadTransactions();

    ToastAndroid.show("Importação feita com sucesso", ToastAndroid.SHORT);
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
          data._raw.amount = newTransaction.amount;
          data._raw.category = newTransaction.category;
          data._raw.quantity = newTransaction.quantity;
          data._raw.quantityDesired = newTransaction.quantityDesired;
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
        importMarket,
        search,
        setSearch,
        updateStock,
        handleAddItensOnBuyList,
      }}
    >
      {props.children}
    </MarketContext.Provider>
  );
}
