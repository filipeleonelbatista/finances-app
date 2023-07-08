import React from "react";
import { Feather } from '@expo/vector-icons';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AboutUs from "./pages/AboutUs";
import Finances from "./pages/Finances";
import Market from "./pages/Market";
import Reports from "./pages/Reports";
import Runs from "./pages/Runs";
import { Text, useColorModeValue, useTheme } from "native-base";
import ActionSheet from "./pages/ActionSheet";
import AddButton from "./components/AddButtton";

const Tab = createBottomTabNavigator();

export default function BottomTabRoutes() {
  const theme = useTheme();

  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

  return (
    <Tab.Navigator
      initialRouteName={"Finanças"}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bg,
          height: 60,
          position: 'relative'
        }
      }}
    >
      <Tab.Screen
        name="Finanças"
        component={Finances}
        options={{
          tabBarLabel: ({ focused }) => <Text color={focused ? theme.colors.purple[600] : text}>Finanças</Text>,
          tabBarIcon: ({ focused }) => <Feather name="dollar-sign" size={24} color={focused ? theme.colors.purple[600] : text} />,
        }}
      />
      <Tab.Screen
        name="Combustível"
        component={Runs}
        options={{
          tabBarLabel: ({ focused }) => <Text color={focused ? theme.colors.purple[600] : text}>Combustível</Text>,
          tabBarIcon: ({ focused }) => <Feather name="droplet" size={24} color={focused ? theme.colors.purple[600] : text} />,
        }}
      />
      <Tab.Screen
        name="Adicionar"
        component={ActionSheet}
        options={{
          tabBarButton: () => <AddButton />
        }}
      />
      <Tab.Screen
        name="Mercado"
        component={Market}
        options={{
          tabBarLabel: ({ focused }) => <Text color={focused ? theme.colors.purple[600] : text}>Mercado</Text>,
          tabBarIcon: ({ focused }) => <Feather name="shopping-cart" size={24} color={focused ? theme.colors.purple[600] : text} />,
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={Reports}
        options={{
          tabBarLabel: ({ focused }) => <Text color={focused ? theme.colors.purple[600] : text}>Relatórios</Text>,
          tabBarIcon: ({ focused }) => <Feather name="pie-chart" size={24} color={focused ? theme.colors.purple[600] : text} />,
        }}
      />
    </Tab.Navigator>
  )
}