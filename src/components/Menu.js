import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Menu({ children }) {
  const navigation = useNavigation();

  const route = useRoute();

  return (
    <View style={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('screen').height - (Dimensions.get('screen').height - Dimensions.get('window').height + (StatusBar.currentHeight < 50 ? StatusBar.currentHeight : 0)),
      position: 'relative',
    }}>
      {children}
      <View style={{ height: 70 }} />
      <View style={styles.menu}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Finanças')} style={styles.button}>
            <Feather name={"dollar-sign"} size={26} color={route.name === "Finanças" ? "#9c44dc" : "#000000"} />
            <Text style={{ ...styles.title, color: route.name === "Finanças" ? "#9c44dc" : "#000000" }}>Finanças</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Combustível')} style={styles.button}>
            <Feather name="droplet" size={26} color={route.name === "Combustível" ? "#9c44dc" : "#000000"} />
            <Text style={{ ...styles.title, color: route.name === "Combustível" ? "#9c44dc" : "#000000" }}>Combustível</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sobre')} style={styles.button}>
            <Feather name="settings" size={26} color={route.name === "Sobre" ? "#9c44dc" : "#000000"} />
            <Text style={{ ...styles.title, color: route.name === "Sobre" ? "#9c44dc" : "#000000" }}>Sobre o app</Text>
          </TouchableOpacity>
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
    width: Dimensions.get('window').width / 3,
    gap: 4,
    height: '100%',
    backgroundColor: "#FFF",
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