import { StatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar } from 'react-native';
import React from 'react';
import Routes from './src/routes';
import { View } from 'react-native';

import AppLoading from 'expo-app-loading';

import {
  Poppins_400Regular,
  Poppins_600SemiBold, useFonts
} from '@expo-google-fonts/poppins';
import { PaymentsContextProvider } from './src/context/PaymentsContext';


export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <View style={{
        height: RNStatusBar.currentHeight,
        backgroundColor: '#442c61'
      }}>
        <StatusBar style="light" />
      </View>
      <PaymentsContextProvider>
        <Routes />
      </PaymentsContextProvider>
    </>
  );

}
