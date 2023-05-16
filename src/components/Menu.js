import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Menu({ children }) {
  const navigation = useNavigation();

  const route = useRoute();

  const {
    currentTheme
  } = useTheme();

  const menus = [
    {
      routeName: 'Finanças',
      iconName: 'dollar-sign',
    },
    {
      routeName: 'Combustível',
      iconName: 'droplet',
    },
    {
      routeName: 'Mercado',
      iconName: 'shopping-cart',
    },
    {
      routeName: 'Relatórios',
      iconName: 'pie-chart',
    },
    {
      routeName: 'Sobre',
      iconName: 'settings',
    },
  ]

  return (
    <View style={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - (StatusBar.currentHeight > 23.9 ? StatusBar.currentHeight : 0),
      position: 'relative',
      backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#f0f2f5',
    }}>
      {children}
      {/* <Text> currentHeight: {StatusBar.currentHeight}</Text> */}
      <View style={{ height: 70 }} />
      <View style={{ ...styles.menu, backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#f0f2f5' }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          {
            menus.map((menu, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(menu.routeName)}
                style={{
                  ...styles.button,
                  width: Dimensions.get('window').width / menus.length,
                  backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF'
                }}>
                <Feather
                  name={menu.iconName}
                  size={26}
                  color={route.name === menu.routeName ? "#9c44dc" : (currentTheme === 'dark' ? '#FFF' : '#1c1e21')}
                />
                <Text
                  style={{
                    ...styles.title,
                    color: route.name === menu.routeName ? "#9c44dc" : (currentTheme === 'dark' ? '#FFF' : '#1c1e21')
                  }}
                >
                  {menu.routeName}
                </Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: Dimensions.get('window').width,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#CCC",
    justifyContent: "center",
    position: 'absolute',
    bottom: 0,
  },
  button: {
    gap: 4,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#000000cd'
  },
})