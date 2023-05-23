import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { BackHandler, Dimensions, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '../hooks/useTheme';

export default function Modal({ open, onClose, children }) {

  const { currentTheme } = useTheme();

  if (!open) return null

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => backHandler.remove();
  })

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      keyboardVerticalOffset={62}
      style={styles.container}
      enabled
    >
      <View style={{ ...styles.card, backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#fff' }}>
        <RectButton onPress={() => onClose()} style={styles.button}>
          <Feather name="x" size={24} color="#FFF" />
        </RectButton>
        <ScrollView style={styles.cardContent}>
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#000000cd',
    zIndex: 100,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    display: 'flex',
    minHeight: 65,
    maxHeight: '90%',
    elevation: 4,
  },
  cardContent: {
    width: '100%',
    display: 'flex',
  },
  button: {
    position: 'absolute',
    zIndex: 150,
    top: 8,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#000000ad',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    color: '#f0f2f5',
  },
})