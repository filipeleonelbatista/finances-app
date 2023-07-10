import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StatusBar as RNStatusBar, View } from 'react-native';
import Routes from './src/routes';

import {
  Poppins_400Regular,
  Poppins_600SemiBold, useFonts
} from '@expo-google-fonts/poppins';

import { Image, NativeBaseProvider, VStack } from 'native-base';

import { GoalsContextProvider } from './src/context/GoalsContext';
import { MarketContextProvider } from './src/context/MarketContext';
import { PagesContextProvider } from './src/context/PagesContext';
import { PaymentsContextProvider } from './src/context/PaymentsContext';
import { RunsContextProvider } from './src/context/RunsContext';
import { SettingsContextProvider } from './src/context/SettingsContext';

import logo from './src/assets/icon.png';

import { LogBox } from "react-native";

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
      <NativeBaseProvider>
        <VStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          bg={"#581c87"}
        >
          <Image
            alt="logo"
            source={logo}
            size={100}
            mb={24}
          />
          <ActivityIndicator size={24} color={"#FFF"} />
        </VStack>
      </NativeBaseProvider>
    )
  }

  return (
    <>
      <View style={{
        height: RNStatusBar.currentHeight,
        backgroundColor: '#581c87'
      }}>
        <StatusBar style="light" />
      </View>
      <NativeBaseProvider>
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
      </NativeBaseProvider>
    </>
  );

}
