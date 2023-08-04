import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";
import { usePayments } from "../hooks/usePayments";

export const ListsContext = createContext({});

export function ListsContextProvider(props) {
  const [lists, setLists] = useState([]);

  const [selectedList, setSelectedList] = useState();

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
        });
      });
    } catch (error) {
      console.log("addTrasaction error", error);
    }

    loadTransactions();
  }

  async function addTrasaction(newTransaction) {
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

      console.log("createdId", createdId);
    } catch (error) {
      console.log("addTrasaction error", error);
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

    return;
  }, [setLists]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <ListsContext.Provider
      value={{
        lists,
        addTrasaction,
        deleteTransaction,
        selectedList,
        setSelectedList,
        updateTransaction,
        addItemToList,
      }}
    >
      {props.children}
    </ListsContext.Provider>
  );
}
