import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext({});

export function ThemeContextProvider(props) {
  let colorScheme = useColorScheme();

  const [currentTheme, setCurrentTheme] = useState('dark')

  const handleToggleTheme = async () => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')
    await AsyncStorage.setItem('Theme', currentTheme === 'dark' ? 'light' : 'dark')
  }

  const loadData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('Theme');
      if (value !== null) {
        setCurrentTheme(value)
      } else {
        setCurrentTheme(colorScheme)
        await AsyncStorage.setItem('Theme', colorScheme)
      }

    } catch (error) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme, handleToggleTheme
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
