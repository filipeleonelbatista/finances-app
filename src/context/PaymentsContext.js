import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';

export const PaymentsContext = createContext({});

export function PaymentsContextProvider(props) {
  const [transactionsList, setTransactionsList] = useState('');
  const [Incomings, setIncomings] = useState("R$ 0,00");
  const [Expenses, setExpenses] = useState("R$ 0,00");
  const [Total, setTotal] = useState("R$ 0,00");

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


      const firstDayOfMonth = dayjs().startOf('month');
      const lastDayOfMonth = dayjs().endOf('month');

      valueArray.map(transaction => {
        const itemDate = dayjs(transaction.date)
        if (itemDate.isAfter(firstDayOfMonth) && itemDate.isBefore(lastDayOfMonth)) {
          if (transaction.isEnabled) {
            expenses = expenses + parseFloat(transaction.amount);
          } else {
            incomings = incomings + parseFloat(transaction.amount);
          }
        }
      });

      total = incomings - expenses;

      setTotal(total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      }));
      setExpenses(expenses.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      }));
      setIncomings(incomings.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      }));

    } catch (e) {
      console.log(e)
      Alert.alert(
        "Erro",
        "Não foi possível carregar dados do armazenamento\n\nErro:\n" + e,
        [
          { text: "OK", onPress: () => console.log('Ok pressed') }
        ],
        { cancelable: false }
      );
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
        addTrasaction,
      }}
    >
      {props.children}
    </PaymentsContext.Provider>
  );
}
