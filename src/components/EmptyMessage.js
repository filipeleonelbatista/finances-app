import React from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import emptyImage from '../assets/add_notes.png';
import { useTheme } from '../hooks/useTheme';

export default function EmptyMessage() {
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme()

  return (
    <View style={{ width, marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
      <Image source={emptyImage} style={{ width: width * 0.6, height: width * 0.6 }} />
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 8,
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 16,
          color: currentTheme !== 'dark' ? '#1c1e21' : '#FFF'
        }}
      >
        Toque em '+' para itens para{'\n'}adicionar itens à tabela!
      </Text>
    </View>
  )
}