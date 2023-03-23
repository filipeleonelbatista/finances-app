import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Menu({ children }) {
  const navigation = useNavigation();

  return (
    <View style={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - StatusBar.currentHeight,
      position: 'relative',
    }}>
      {children}
      <View style={{ height: 70 }} />
      <View style={styles.menu}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Finanças')} style={styles.button}>
            <MaterialIcons name={"attach-money"} size={32} color="#00000" />
            <Text style={styles.title}>Finanças</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Combustível')} style={styles.button}>
            <MaterialCommunityIcons name="fuel" size={32} color="#000000" />
            <Text style={styles.title}>Combustível</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sobre')} style={styles.button}>
            <MaterialCommunityIcons name="cog" size={32} color="#000000" />
            <Text style={styles.title}>Sobre o app</Text>
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
    borderTopWidth: 2,
    borderTopColor: "#CCC",
    justifyContent: "center",
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: Dimensions.get('window').width / 3,
    height: '100%',
    backgroundColor: "#FFF",
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000cd'
  },
})