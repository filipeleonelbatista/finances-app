import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Market from "./pages/Market";
import List from "./pages/List";
import Lists from "./pages/Lists";

const Stack = createStackNavigator();

export default function MarketStackRoutes() {
  return (
    <Stack.Navigator
      initialRouteName={"Stock"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Stock" component={Market} />
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="Lists" component={Lists} />
    </Stack.Navigator>
  );
}
