import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const valueArray = JSON.parse(value)
      if (value !== null) {
        setTransactionsList(valueArray)
      } else {
        await AsyncStorage.setItem('transactions', JSON.stringify([]));
      }
      let incomings = 0;
      let expenses = 0;
      let total = 0;

      valueArray.map(transaction => {
        if (transaction.isExpense) {
          expenses = expenses + parseFloat(transaction.amount);
        } else {
          incomings = incomings + parseFloat(transaction.amount);
        }
      });

      total = incomings - expenses;

      let totalFormat = String(total).replace(/\D/g, "");
      totalFormat = totalFormat.replace(/(\d)(\d{2})$/, "$1,$2");
      totalFormat = totalFormat.replace(/(?=(\d{3})+(\D))\B/g, ".");

      let expenseFormat = String(expenses).replace(/\D/g, "");
      expenseFormat = expenseFormat.replace(/(\d)(\d{2})$/, "$1,$2");
      expenseFormat = expenseFormat.replace(/(?=(\d{3})+(\D))\B/g, ".");

      let incomingsFormat = String(incomings).replace(/\D/g, "");
      incomingsFormat = incomingsFormat.replace(/(\d)(\d{2})$/, "$1,$2");
      incomingsFormat = incomingsFormat.replace(/(?=(\d{3})+(\D))\B/g, ".");

      let resultTotal = total >= 0 ? "R$ " + (totalFormat === "0" ? "0,00" : (total < 100 ? "0," + (total < 10 ? "0" + totalFormat : totalFormat) : totalFormat)) : "-R$ " + (total > -100 ? "0," + (total > -10 ? "0" + totalFormat : totalFormat) : totalFormat);
      let resultExpense = expenses === 0 ? "R$ 0,00" : (expenses < 100 ? "-R$ 0," + (expenses < 10 ? "0" + expenseFormat : expenseFormat) : "-R$ " + expenseFormat);
      let resultIncoming = incomings === 0 ? "R$ 0,00" : (incomings < 100 ? "R$ 0," + (incomings < 10 ? "0" + incomingsFormat : incomingsFormat) : "R$ " + incomingsFormat);

      setTotal(resultTotal);
      setExpenses(resultExpense);
      setIncomings(resultIncoming);
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
