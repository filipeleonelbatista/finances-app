import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, DevSettings, ToastAndroid } from "react-native";

export const SettingsContext = createContext({});

export function SettingsContextProvider(props) {

  const [isEnableTitheCard, setIsEnableTitheCard] = useState(false)
  const [isEnableTotalHistoryCard, setIsEnableTotalHistoryCard] = useState(false)
  const [willAddFuelToTransactionList, setWillAddFuelToTransactionList] = useState(false)
  const [willUsePrefixToRemoveTihteSum, setWillUsePrefixToRemoveTihteSum] = useState(false)
  const [simpleFinancesItem, setSimpleFinancesItem] = useState(false)
  const [marketSimplifiedItems, setMarketSimplifiedItems] = useState(false)
  const [prefixTithe, setPrefixTithe] = useState('')

  const handleCleanAsyncStorage = async () => {
    Alert.alert(
      "Deseja realmente Eliminar todos os registros?",
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
            await AsyncStorage.clear();
            ToastAndroid.show('Transação Removida', ToastAndroid.SHORT);
            DevSettings.reload()
          },
        },
      ])
  }

  const handleSetmarketSimplifiedItems = async (value) => {
    setMarketSimplifiedItems(value)
    await AsyncStorage.setItem('@MarketSimplifiedItems', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSetSimpleFinancesItem = async (value) => {
    setSimpleFinancesItem(value)
    await AsyncStorage.setItem('@SimpleFinancesItem', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSetPrefixTithe = async (value) => {
    setPrefixTithe(value)
    await AsyncStorage.setItem('@PrefixTithe', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleToggleWillAddFuel = async (value) => {
    setWillAddFuelToTransactionList(value)
    await AsyncStorage.setItem('@WillAddFuelToTransactionList', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleWillRemovePrefixToRemove = async (value) => {
    setWillUsePrefixToRemoveTihteSum(value)
    await AsyncStorage.setItem('@WillUsePrefixToRemoveTihteSum', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSwitchViewTotalHistoryCard = async (value) => {
    setIsEnableTotalHistoryCard(value)
    await AsyncStorage.setItem('@IsEnableTotalHistoryCard', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSwitchViewTitheCard = async (value) => {
    setIsEnableTitheCard(value)
    await AsyncStorage.setItem('@IsEnableTitheCard', JSON.stringify(value))
    await updateStorageContext()
  }

  const updateStorageContext = async () => {
    try {
      await loadIsEnableTitheCard();
      await loadIsEnableTotalHistoryCard();
      await loadWillAddFuelToTransactionList();
      await loadWillUsePrefixToRemoveTihteSum();
      await loadPrefixTithe();
      await loadSimpleFinancesItem();
      await loadMarketSimplifiedItems();
    } catch (error) {
      console.log(error)
    }
  }

  const loadIsEnableTitheCard = async () => {
    const value = await AsyncStorage.getItem('@IsEnableTitheCard');
    if (value !== null) {
      setIsEnableTitheCard(JSON.parse(value))
    } else {
      setIsEnableTitheCard(isEnableTitheCard)
      await AsyncStorage.setItem('@IsEnableTitheCard', JSON.stringify(isEnableTitheCard))
    }
  }

  const loadIsEnableTotalHistoryCard = async () => {
    const value = await AsyncStorage.getItem('@IsEnableTotalHistoryCard');
    if (value !== null) {
      setIsEnableTotalHistoryCard(JSON.parse(value))
    } else {
      setIsEnableTotalHistoryCard(isEnableTotalHistoryCard)
      await AsyncStorage.setItem('@IsEnableTotalHistoryCard', JSON.stringify(isEnableTotalHistoryCard))
    }
  }

  const loadWillAddFuelToTransactionList = async () => {
    const value = await AsyncStorage.getItem('@WillAddFuelToTransactionList');
    if (value !== null) {
      setWillAddFuelToTransactionList(JSON.parse(value))
    } else {
      setWillAddFuelToTransactionList(willAddFuelToTransactionList)
      await AsyncStorage.setItem('@WillAddFuelToTransactionList', JSON.stringify(willAddFuelToTransactionList))
    }
  }

  const loadWillUsePrefixToRemoveTihteSum = async () => {
    const value = await AsyncStorage.getItem('@WillUsePrefixToRemoveTihteSum');
    if (value !== null) {
      setWillUsePrefixToRemoveTihteSum(JSON.parse(value))
    } else {
      setWillUsePrefixToRemoveTihteSum(willUsePrefixToRemoveTihteSum)
      await AsyncStorage.setItem('@WillUsePrefixToRemoveTihteSum', JSON.stringify(willUsePrefixToRemoveTihteSum))
    }
  }

  const loadPrefixTithe = async () => {
    const value = await AsyncStorage.getItem('@PrefixTithe');
    if (value !== null) {
      setPrefixTithe(JSON.parse(value))
    } else {
      setPrefixTithe(prefixTithe)
      await AsyncStorage.setItem('@PrefixTithe', JSON.stringify(prefixTithe))
    }
  }

  const loadSimpleFinancesItem = async () => {
    const value = await AsyncStorage.getItem('@SimpleFinancesItem');
    if (value !== null) {
      setSimpleFinancesItem(JSON.parse(value))
    } else {
      setSimpleFinancesItem(simpleFinancesItem)
      await AsyncStorage.setItem('@SimpleFinancesItem', JSON.stringify(simpleFinancesItem))
    }
  }

  const loadMarketSimplifiedItems = async () => {
    const value = await AsyncStorage.getItem('@MarketSimplifiedItems');
    if (value !== null) {
      setMarketSimplifiedItems(JSON.parse(value))
    } else {
      setMarketSimplifiedItems(marketSimplifiedItems)
      await AsyncStorage.setItem('@MarketSimplifiedItems', JSON.stringify(marketSimplifiedItems))
    }
  }

  const loadData = useCallback(async () => {
    try {
      await loadIsEnableTitheCard();
      await loadIsEnableTotalHistoryCard();
      await loadWillAddFuelToTransactionList();
      await loadWillUsePrefixToRemoveTihteSum();
      await loadPrefixTithe();
      await loadSimpleFinancesItem();
      await loadMarketSimplifiedItems();
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData]);

  return (
    <SettingsContext.Provider
      value={{
        isEnableTitheCard,
        handleSwitchViewTitheCard,
        willAddFuelToTransactionList,
        handleToggleWillAddFuel,
        willUsePrefixToRemoveTihteSum,
        handleWillRemovePrefixToRemove,
        prefixTithe,
        handleSetPrefixTithe,
        isEnableTotalHistoryCard,
        handleSwitchViewTotalHistoryCard,
        handleCleanAsyncStorage,
        simpleFinancesItem,
        setSimpleFinancesItem,
        handleSetSimpleFinancesItem,
        marketSimplifiedItems,
        setMarketSimplifiedItems,
        handleSetmarketSimplifiedItems
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
