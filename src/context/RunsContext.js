import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';

export const RunsContext = createContext({});

export function RunsContextProvider(props) {
  const { addTrasaction: addPaymentTransaction, deleteTransaction: deletePayentTransaction } = usePayments();
  const { willAddFuelToTransactionList } = useSettings()
  const [FuelList, setFuelList] = useState([]);
  const [autonomy, setAutonomy] = useState(0);

  const setAutonomyValue = async (value) => {
    setAutonomy(value)
    await AsyncStorage.setItem('autonomy', JSON.stringify(value))
  }

  async function importRuns(importedList) {
    const newTransactionList = [
      ...FuelList,
      ...importedList
    ]

    await AsyncStorage.setItem('runs', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Importação feita com sucesso', ToastAndroid.SHORT);
  }

  async function deleteTransaction(currentTransaction) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => console.log('Não pressed'),
        },
        {
          text: 'Sim',
          onPress: async () => {

            const newTransactionList = FuelList.filter(item => item.id !== currentTransaction.id);

            await AsyncStorage.setItem('runs', JSON.stringify(newTransactionList));

            loadTransactions()

            ToastAndroid.show('Abastecimento Removido', ToastAndroid.SHORT);
          },
        },
      ])
  }

  async function addTrasaction(newTransaction) {
    const newTransactionList = [
      ...FuelList,
      {
        id: v4(),
        ...newTransaction
      }
    ]

    if (willAddFuelToTransactionList) {
      const newPaymentTransaction = {
        description: `Abastecimento - ${newTransaction.location}`,
        amount: newTransaction.amount,
        date: newTransaction.date,
        paymentDate: newTransaction.date,
        paymentStatus: true,
        isEnabled: true
      }

      await addPaymentTransaction(newPaymentTransaction)
    }

    await AsyncStorage.setItem('runs', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Abastecimento Adicionado', ToastAndroid.SHORT);

  }

  const loadTransactions = useCallback(async () => {
    try {
      const autonomyValue = await AsyncStorage.getItem('autonomy');
      if (autonomyValue !== null) {
        const autonomyValueParsed = JSON.parse(autonomyValue ?? '0')
        setAutonomy(autonomyValueParsed)
      } else {
        await AsyncStorage.setItem('autonomy', JSON.stringify(0));
      }

      const value = await AsyncStorage.getItem('runs');
      if (value !== null) {
        const valueArray = JSON.parse(value)
        setFuelList(valueArray)
      } else {
        await AsyncStorage.setItem('runs', JSON.stringify([]));
      }

    } catch (e) {
      console.log(e)
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
        addTrasaction,
        deleteTransaction,
        importRuns
      }}
    >
      {props.children}
    </RunsContext.Provider>
  );
}
