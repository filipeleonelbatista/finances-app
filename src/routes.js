import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { StyleSheet } from "react-native";
import AboutUs from "./pages/AboutUs";
import Finances from "./pages/Finances";
import Runs from "./pages/Runs";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Combustível"
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
          name="Sobre"
          component={AboutUs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
});
