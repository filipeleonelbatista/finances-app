import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Menu() {
  const navigation = useNavigation();


  return (
    <View style={{ width: Dimensions.get('window').width }}>
      <Text style={{ ...styles.title, fontSize: 18, marginLeft: 16, marginBottom: 8 }}>Menu Principal</Text>
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Finanças')} style={styles.button}>
            <MaterialIcons name={"attach-money"} size={32} color="#00000" />
          </TouchableOpacity>
          <Text style={styles.title}>Finanças</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Combustível')} style={styles.button}>
            <MaterialCommunityIcons name="fuel" size={32} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Combustível</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate('Sobre')} style={styles.button}>
            <MaterialCommunityIcons name="cog" size={32} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Sobre o app</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    width: 82,
    height: 82,
    borderRadius: 82 / 2,
    backgroundColor: "#CCC",
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000cd'
  },
})