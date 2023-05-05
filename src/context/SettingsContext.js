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

  const handleSetSimpleFinancesItem = async (value) => {
    setSimpleFinancesItem(value)
    await updateStorageContext()
  }

  const handleSetPrefixTithe = async (value) => {
    setPrefixTithe(value)
    await updateStorageContext()
  }

  const handleToggleWillAddFuel = async (value) => {
    setWillAddFuelToTransactionList(value)
    await updateStorageContext()
  }

  const handleWillRemovePrefixToRemove = async (value) => {
    setWillUsePrefixToRemoveTihteSum(value)
    await updateStorageContext()
  }

  const handleSwitchViewTotalHistoryCard = async (value) => {
    setIsEnableTotalHistoryCard(value)
    await updateStorageContext()
  }

  const handleSwitchViewTitheCard = async (value) => {
    setIsEnableTitheCard(value)
    await updateStorageContext()
  }

  const updateStorageContext = async () => {
    const defaultSettings = {
      isEnableTitheCard,
      isEnableTotalHistoryCard,
      willAddFuelToTransactionList,
      willUsePrefixToRemoveTihteSum,
      prefixTithe,
      simpleFinancesItem
    }
    await AsyncStorage.setItem('Settings', JSON.stringify(defaultSettings))
  }

  const loadData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('Settings');
      if (value !== null) {
        const currentSettings = JSON.parse(value)
        setIsEnableTitheCard(currentSettings.isEnableTitheCard)
        setIsEnableTotalHistoryCard(currentSettings.isEnableTotalHistoryCard)
        setWillAddFuelToTransactionList(currentSettings.willAddFuelToTransactionList)
        setWillUsePrefixToRemoveTihteSum(currentSettings.willUsePrefixToRemoveTihteSum)
        setPrefixTithe(currentSettings.prefixTithe)
        setSimpleFinancesItem(currentSettings.simpleFinancesItem)
      } else {
        const defaultSettings = {
          isEnableTitheCard,
          isEnableTotalHistoryCard,
          willAddFuelToTransactionList,
          willUsePrefixToRemoveTihteSum,
          prefixTithe,
          simpleFinancesItem
        }

        await AsyncStorage.setItem('Settings', JSON.stringify(defaultSettings))
      }

    } catch (error) {
      console.log(e)
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
        handleSetSimpleFinancesItem
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
