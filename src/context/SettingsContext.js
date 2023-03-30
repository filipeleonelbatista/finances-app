import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const SettingsContext = createContext({});

export function SettingsContextProvider(props) {

  const [isEnableTitheCard, setIsEnableTitheCard] = useState(false)
  const [willAddFuelToTransactionList, setWillAddFuelToTransactionList] = useState(false)
  const [willUsePrefixToRemoveTihteSum, setWillUsePrefixToRemoveTihteSum] = useState(false)
  const [prefixTithe, setPrefixTithe] = useState('')

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

  const handleSwitchViewTitheCard = async (value) => {
    setIsEnableTitheCard(value)
    await updateStorageContext()
  }

  const updateStorageContext = async () => {
    const defaultSettings = {
      isEnableTitheCard,
      willAddFuelToTransactionList,
      willUsePrefixToRemoveTihteSum,
      prefixTithe,
    }
    await AsyncStorage.setItem('Settings', JSON.stringify(defaultSettings))
  }

  const loadData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('Settings');
      if (value !== null) {
        const currentSettings = JSON.parse(value)
        setIsEnableTitheCard(currentSettings.isEnableTitheCard)
        setWillAddFuelToTransactionList(currentSettings.willAddFuelToTransactionList)
        setWillUsePrefixToRemoveTihteSum(currentSettings.willUsePrefixToRemoveTihteSum)
        setPrefixTithe(currentSettings.setPrefixTithe)
      } else {
        const defaultSettings = {
          isEnableTitheCard,
          willAddFuelToTransactionList,
          willUsePrefixToRemoveTihteSum,
          setPrefixTithe,
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
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}
