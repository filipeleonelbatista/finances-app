import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Onboarding from "./pages/Onboarding";
import BottomTabRoutes from "./bottom-tab-routes";
import AboutUs from "./pages/AboutUs";
import { useColorMode } from "native-base";
import IAPage from "./pages/IAPage";

const Stack = createStackNavigator();

export default function Routes() {

  const {
    colorMode
  } = useColorMode();

  return (
    <NavigationContainer theme={{ colors: { background: colorMode === 'dark' ? '#1c1e21' : '#f0f2f5', } }}>
      <Stack.Navigator
        initialRouteName={"Onboarding"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
        />
        <Stack.Screen
          name="Configuracoes"
          component={AboutUs}
        />
        <Stack.Screen
          name="IAPage"
          component={IAPage}
        />
        <Stack.Screen
          name="TabNavigator"
          component={BottomTabRoutes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}