import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AboutUs from "./pages/AboutUs";
import Finances from "./pages/Finances";
import Market from "./pages/Market";
import Runs from "./pages/Runs";

import { useTheme } from "./hooks/useTheme";

const Stack = createStackNavigator();

export default function Routes() {

  const { currentTheme } = useTheme()

  return (
    <NavigationContainer theme={{ colors: { background: currentTheme === 'dark' ? '#1c1e21' : '#f0f2f5', } }}>
      <Stack.Navigator
        initialRouteName={"Finanças"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Finanças"
          component={Finances}
        />
        <Stack.Screen
          name="Combustível"
          component={Runs}
        />
        <Stack.Screen
          name="Mercado"
          component={Market}
        />
        <Stack.Screen
          name="Sobre"
          component={AboutUs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}