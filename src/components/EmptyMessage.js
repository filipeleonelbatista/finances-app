import { Image, Text, VStack, useColorModeValue, useTheme, } from 'native-base';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import emptyImage from '../assets/add_notes.png';

export default function EmptyMessage() {
  const { width } = useWindowDimensions();

  const theme = useTheme();
  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

  return (
    <VStack alignItems="center" space={4} my={8}>
      <Image alt="No Data" source={emptyImage} style={{ width: width * 0.6, height: width * 0.6 }} />
      <Text
        textAlign="center"
        bold
        color={text}
      >
        Toque em '+' para itens para{'\n'}adicionar itens à tabela!
      </Text>
    </VStack>
  )
}