import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorMode } from "native-base";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, DevSettings, ToastAndroid } from "react-native";

export const SettingsContext = createContext({});

export function SettingsContextProvider(props) {

  const {
    colorMode,
    toggleColorMode,
    setColorMode,
  } = useColorMode();

  const handleToggleTheme = async () => {
    await AsyncStorage.setItem('@Theme', colorMode === 'dark' ? 'light' : 'dark')
    toggleColorMode()
  }

  const [isAiEnabled, setIsAiEnabled] = useState(false)
  const [isShowLabelOnNavigation, setIsShowLabelOnNavigation] = useState(false)
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

  const handleSetIsAiEnabled = async (value) => {
    setIsAiEnabled(value)
    await AsyncStorage.setItem('@IsAiEnabled', JSON.stringify(value))
    await updateStorageContext()
  }

  const handleSetIsShowLabelOnNavigation = async (value) => {
    setIsShowLabelOnNavigation(value)
    await AsyncStorage.setItem('@IsShowLabelOnNavigation', JSON.stringify(value))
    await updateStorageContext()
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
      await loadAiConfigFromStorage();
      await loadThemeFromStorage();
      await loadIsShowLabelOnNavigation();
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

  const loadAiConfigFromStorage = async () => {
    const value = await AsyncStorage.getItem('@IsAiEnabled');
    if (value !== null) {
      setIsAiEnabled(JSON.parse(value))
    } else {
      setIsAiEnabled(isAiEnabled)
      await AsyncStorage.setItem('@IsAiEnabled', JSON.stringify(isAiEnabled))
    }
  }

  const loadThemeFromStorage = async () => {
    const value = await AsyncStorage.getItem('@Theme');
    if (value !== null) {
      setColorMode(value)
    } else {
      setColorMode(colorMode)
      await AsyncStorage.setItem('@Theme', colorMode)
    }
  }

  const loadIsShowLabelOnNavigation = async () => {
    const value = await AsyncStorage.getItem('@IsShowLabelOnNavigation');
    if (value !== null) {
      setIsShowLabelOnNavigation(JSON.parse(value))
    } else {
      setIsShowLabelOnNavigation(isShowLabelOnNavigation)
      await AsyncStorage.setItem('@IsShowLabelOnNavigation', JSON.stringify(isShowLabelOnNavigation))
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
      await loadAiConfigFromStorage();
      await loadThemeFromStorage();
      await loadIsShowLabelOnNavigation();
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
        handleSetmarketSimplifiedItems,
        isShowLabelOnNavigation,
        setIsShowLabelOnNavigation,
        handleSetIsShowLabelOnNavigation,
        handleToggleTheme,
        handleSetIsAiEnabled,
        isAiEnabled
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
