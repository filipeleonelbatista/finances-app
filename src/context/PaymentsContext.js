import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';

export const PaymentsContext = createContext({});

export function PaymentsContextProvider(props) {
  const [transactionsList, setTransactionsList] = useState('');
  const [Incomings, setIncomings] = useState(0);
  const [Expenses, setExpenses] = useState(0);
  const [Total, setTotal] = useState(0);
  const [Tithe, setTithe] = useState(0);
  const [Saldo, setSaldo] = useState(0);

  async function updateTransaction(currentTransaction) {
    const index = transactionsList.findIndex(item => item.id === currentTransaction.id)
    if (index !== -1) {
      const newTransactionList = transactionsList;
      newTransactionList[index] = currentTransaction;

      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

      loadTransactions()

      ToastAndroid.show('Transação Atualizada', ToastAndroid.SHORT);
    }
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

            const newTransactionList = transactionsList.filter(item => item.id !== currentTransaction.id);

            await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

            loadTransactions()

            ToastAndroid.show('Transação Removida', ToastAndroid.SHORT);
          },
        },
      ])
  }

  async function addTrasaction(newTransaction) {

    const newTransactionList = [
      ...transactionsList,
      {
        id: v4(),
        ...newTransaction
      }
    ]

    await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Transação Adicionada', ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    // await AsyncStorage.clear();
    try {
      const value = await AsyncStorage.getItem('transactions');
      const valueArray = JSON.parse(value ?? '[]')
      if (value !== null) {
        setTransactionsList(valueArray)
      } else {
        await AsyncStorage.setItem('transactions', JSON.stringify([]));
      }
      let incomings = 0;
      let expenses = 0;
      let total = 0;
      let saldo = 0;


      const firstDayOfMonth = dayjs().startOf('month');
      const lastDayOfMonth = dayjs().endOf('month');

      valueArray.map(transaction => {
        const itemDate = dayjs(transaction.date)
        if (transaction.isEnabled) {
          saldo = saldo - parseFloat(transaction.amount);
        } else {
          saldo = saldo + parseFloat(transaction.amount);
        }
        if (itemDate.isAfter(firstDayOfMonth) && itemDate.isBefore(lastDayOfMonth)) {
          if (transaction.isEnabled) {
            expenses = expenses + parseFloat(transaction.amount);
          } else {
            incomings = incomings + parseFloat(transaction.amount);
          }
        }
      });

      total = incomings - expenses;
      setSaldo(saldo)
      setTithe(((total * 10) / 100));
      setTotal(total);
      setExpenses(expenses);
      setIncomings(incomings);

    } catch (e) {
      console.log(e)
    }

    return;

  }, [setTransactionsList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <PaymentsContext.Provider
      value={{
        transactionsList,
        Incomings,
        Expenses,
        Total,
        Tithe,
        Saldo,
        addTrasaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {props.children}
    </PaymentsContext.Provider>
  );
}
