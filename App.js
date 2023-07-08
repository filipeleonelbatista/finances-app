import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Image, StatusBar as RNStatusBar, View } from 'react-native';
import Routes from './src/routes';

import {
  Poppins_400Regular,
  Poppins_600SemiBold, useFonts
} from '@expo-google-fonts/poppins';
import { NativeBaseProvider } from 'native-base';
import logo from './src/assets/icon.png';
import { GoalsContextProvider } from './src/context/GoalsContext';
import { MarketContextProvider } from './src/context/MarketContext';
import { PaymentsContextProvider } from './src/context/PaymentsContext';
import { RunsContextProvider } from './src/context/RunsContext';
import { SettingsContextProvider } from './src/context/SettingsContext';
import { ThemeContextProvider } from './src/context/ThemeContext';

import { LogBox } from "react-native";
import { PagesContextProvider } from './src/context/PagesContext';

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
])

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#442c61"
      }}>
        <Image
          source={logo}
          style={{
            width: 100,
            height: 100,
            marginBottom: 24,
          }}
        />
        <ActivityIndicator color={"#FFF"} />
      </View>)
  }

  return (
    <>
      <View style={{
        height: RNStatusBar.currentHeight,
        backgroundColor: '#442c61'
      }}>
        <StatusBar style="light" />
      </View>
      <NativeBaseProvider>
        <ThemeContextProvider>
          <PagesContextProvider>
            <SettingsContextProvider>
              <PaymentsContextProvider>
                <RunsContextProvider>
                  <MarketContextProvider>
                    <GoalsContextProvider>
                      <Routes />
                    </GoalsContextProvider>
                  </MarketContextProvider>
                </RunsContextProvider>
              </PaymentsContextProvider>
            </SettingsContextProvider>
          </PagesContextProvider>
        </ThemeContextProvider>
      </NativeBaseProvider>
    </>
  );

}
