import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';
import { usePayments } from '../hooks/usePayments';

export const MarketContext = createContext({});

export function MarketContextProvider(props) {
  const { addTrasaction: addPaymentTransaction } = usePayments();
  const [MarketList, setMarketList] = useState([]);

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedCategory, setSelectedCategory] = useState('Todos os itens');

  const filteredList = useMemo(() => {
    const filteredCategory = MarketList.filter(item => {
      if (selectedCategory === 'Todos os itens') {
        return true;
      } else {
        return item.category === selectedCategory;
      }
    })
    return filteredCategory ?? [];
  }, [MarketList, selectedCategory])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + (item.amount * item.quantity)
    }

    return TotalList
  }, [filteredList])

  async function handleAddFinances() {
    const data = {
      description: `Compras`,
      amount: listTotal,
      date: Date.now(),
      isEnabled: true
    }
    addPaymentTransaction(data)
  }

  async function updateTransaction(currentTransaction) {
    const index = MarketList.findIndex(item => item.id === currentTransaction.id)
    if (index !== -1) {
      const newTransactionList = MarketList;
      newTransactionList[index] = currentTransaction;

      await AsyncStorage.setItem('market', JSON.stringify(newTransactionList));

      loadTransactions()

      ToastAndroid.show('Item atualizado com sucesso', ToastAndroid.SHORT);
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

            const newTransactionList = MarketList.filter(item => item.id !== currentTransaction.id);

            await AsyncStorage.setItem('market', JSON.stringify(newTransactionList));

            loadTransactions()

            ToastAndroid.show('Item removido do carrinho', ToastAndroid.SHORT);
          },
        },
      ])
  }

  async function addTrasaction(newTransaction) {
    const newTransactionList = [
      ...MarketList,
      {
        id: v4(),
        ...newTransaction
      }
    ]

    await AsyncStorage.setItem('market', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Item adicionado ao carrinho', ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('market');
      if (value !== null) {
        const valueArray = JSON.parse(value)
        setMarketList(valueArray)
      } else {
        await AsyncStorage.setItem('fuel', JSON.stringify([]));
      }
    } catch (e) {
      console.log(e)
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
        filteredList,
        listTotal,
        selectedCategory,
        setSelectedCategory,
        addTrasaction,
        deleteTransaction,
        selectedTransaction,
        setSelectedTransaction,
        updateTransaction,
        handleAddFinances
      }}
    >
      {props.children}
    </MarketContext.Provider>
  );
}
