import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';
import { usePayments } from '../hooks/usePayments';

export const MarketContext = createContext({});

export function MarketContextProvider(props) {
  const { addTrasaction: addPaymentTransaction } = usePayments();
  const [MarketList, setMarketList] = useState([]);
  const [estimative, setEstimative] = useState(0);

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedCategory, setSelectedCategory] = useState('Todos os itens');
  const [search, setSearch] = useState('');

  const setEstimativeValue = async (value) => {
    setEstimative(value)
    await AsyncStorage.setItem('estimative', JSON.stringify(value))
  }


  const filteredList = useMemo(() => {
    const filteredCategory = MarketList.filter(item => {
      if (selectedCategory === 'Todos os itens') {
        return true;
      } else {
        return item.category === selectedCategory;
      }
    })

    const filteredWords = search === '' ? filteredCategory : filteredCategory.filter(item => item.description.includes(search))

    return filteredWords ?? [];
  }, [MarketList, selectedCategory, search])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + (item.amount * item.quantity)
    }

    return TotalList
  }, [filteredList])

  async function handleAddFinances() {
    const data = {
      description: `Lista Compras`,
      amount: listTotal,
      date: Date.now(),
      category: 'Mercado',
      paymentDate: '',
      paymentStatus: false,
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

  async function updateStock(currentTransaction, isAdd = false) {
    const index = MarketList.findIndex(item => item.id === currentTransaction.id)
    if (index !== -1) {
      const newTransactionList = MarketList;

      const newTransaction = currentTransaction;
      newTransaction.quantity = isAdd ? newTransaction.quantity + 1 : newTransaction.quantity - 1;

      newTransactionList[index] = newTransaction;

      await AsyncStorage.setItem('market', JSON.stringify(newTransactionList));

      loadTransactions()

      ToastAndroid.show('Item atualizado com sucesso', ToastAndroid.SHORT);
    }
  }

  async function importMarket(importedList) {
    const newTransactionList = [
      ...MarketList,
      ...importedList
    ]

    await AsyncStorage.setItem('market', JSON.stringify(newTransactionList));

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

      const estimative = await AsyncStorage.getItem('estimative');
      if (estimative !== null) {
        const estimativeParsed = JSON.parse(estimative ?? '0')
        setEstimative(estimativeParsed)
      } else {
        await AsyncStorage.setItem('estimative', JSON.stringify(0));
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
        setMarketList,
        filteredList,
        listTotal,
        selectedCategory,
        setSelectedCategory,
        addTrasaction,
        deleteTransaction,
        selectedTransaction,
        setSelectedTransaction,
        updateTransaction,
        handleAddFinances,
        estimative,
        setEstimativeValue,
        importMarket,
        search, setSearch,
        updateStock
      }}
    >
      {props.children}
    </MarketContext.Provider>
  );
}
