import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Image, StatusBar as RNStatusBar, View } from 'react-native';
import Routes from './src/routes';

import {
  Poppins_400Regular,
  Poppins_600SemiBold, useFonts
} from '@expo-google-fonts/poppins';
import { PaymentsContextProvider } from './src/context/PaymentsContext';

import logo from './src/assets/icon.png';
import { RunsContextProvider } from './src/context/RunsContext';
import { SettingsContextProvider } from './src/context/SettingsContext';

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
      <SettingsContextProvider>
        <PaymentsContextProvider>
          <RunsContextProvider>
            <Routes />
          </RunsContextProvider>
        </PaymentsContextProvider>
      </SettingsContextProvider>
    </>
  );

}
