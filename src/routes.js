import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AboutUs from "./pages/AboutUs";
import Finances from "./pages/Finances";
import Runs from "./pages/Runs";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Combustível"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#F2F3F5" },
          tabBarStyle: { height: 60 }
        }}
        
        tabBarOptions={{
          showLabel: false,
          style: {
            backgroundColor: "#FFF",
            height: 70,
            ...styles.shadow,
          },
        }}
      >
        <Tab.Screen
          name="Finanças"
          component={Finances}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.container}>
                <Feather
                  name="dollar-sign"
                  size={24}
                  color={focused ? "#9c44dc" : "black"}
                />
                <Text
                  style={{
                    ...styles.title,
                    color: focused ? "#9c44dc" : "black",
                  }}
                >
                  Finanças
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Combustível"
          component={Runs}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.container}>
                <Feather
                  name="droplet"
                  size={24}
                  color={focused ? "#9c44dc" : "black"}
                />
                <Text
                  style={{
                    ...styles.title,
                    color: focused ? "#9c44dc" : "black",
                  }}
                >
                  Combustível
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Sobre"
          component={AboutUs}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.container}>
                <Feather
                  name="settings"
                  size={24}
                  color={focused ? "#9c44dc" : "black"}
                />
                <Text
                  style={{
                    ...styles.title,
                    color: focused ? "#9c44dc" : "black",
                  }}
                >
                  Sobre
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
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
