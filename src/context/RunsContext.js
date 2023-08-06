import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";
import { usePayments } from "../hooks/usePayments";
import { useSettings } from "../hooks/useSettings";

export const RunsContext = createContext({});

export function RunsContextProvider(props) {
  const {
    addTransaction: addPaymentTransaction,
    deleteTransaction: deletePayentTransaction,
  } = usePayments();
  const { willAddFuelToTransactionList } = useSettings();
  const [FuelList, setFuelList] = useState([]);
  const [autonomy, setAutonomy] = useState(0);

  const setAutonomyValue = async (value) => {
    setAutonomy(value);
    await AsyncStorage.setItem("autonomy", JSON.stringify(value));
  };

  async function importRuns(importedList) {
    const newTransactionList = [...FuelList, ...importedList];

    await AsyncStorage.setItem("runs", JSON.stringify(newTransactionList));

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
                .get("runs")
                .find(currentTransaction.id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });
            } catch (error) {
              console.log("deleteTransaction error", error);
            }

            loadTransactions();

            ToastAndroid.show("Abastecimento Removido", ToastAndroid.SHORT);
          },
        },
      ]
    );
  }

  async function addTransaction(newTransaction) {
    try {
      await database.write(async () => {
        await database.get("runs").create((data) => {
          data._raw.currentDistance = newTransaction.currentDistance;
          data._raw.unityAmount = newTransaction.unityAmount;
          data._raw.amount = newTransaction.amount;
          data._raw.type = newTransaction.type;
          data._raw.date = newTransaction.date;
          data._raw.location = newTransaction.location;
        });
      });
    } catch (error) {
      console.log("addTransaction error", error);
    }

    if (willAddFuelToTransactionList) {
      const newPaymentTransaction = {
        description: `Abastecimento - ${newTransaction.location}`,
        amount: newTransaction.amount,
        date: newTransaction.date,
        category: "Transporte",
        paymentDate: newTransaction.date,
        paymentStatus: true,
        isEnabled: true,
        isFavorited: false,
      };

      await addPaymentTransaction(newPaymentTransaction);
    }

    loadTransactions();

    ToastAndroid.show("Abastecimento Adicionado", ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    try {
      const fuelListCollection = database.get("runs");
      const response = await fuelListCollection.query().fetch();
      const currentList = response.map((item) => item._raw);
      setFuelList(currentList);
    } catch (error) {
      setFuelList([]);
    }

    // TODO: autonomy vai vir da tabela application depois junto de veicle information
    try {
      const autonomyValue = await AsyncStorage.getItem("autonomy");
      if (autonomyValue !== null) {
        const autonomyValueParsed = JSON.parse(autonomyValue ?? "0");
        setAutonomy(autonomyValueParsed);
      } else {
        await AsyncStorage.setItem("autonomy", JSON.stringify(0));
      }
    } catch (e) {
      console.log(e);
    }

    return;
  }, [setFuelList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <RunsContext.Provider
      value={{
        FuelList,
        setFuelList,
        autonomy,
        setAutonomyValue,
        addTransaction,
        deleteTransaction,
        importRuns,
      }}
    >
      {props.children}
    </RunsContext.Provider>
  );
}
