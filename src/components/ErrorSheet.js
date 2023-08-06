import { Image, Text, VStack, useColorModeValue, useTheme } from "native-base";
import React from "react";
import { useWindowDimensions } from "react-native";
import emptyImage from "../assets/add_notes.png";

export default function ErrorSheet() {
  const { width } = useWindowDimensions();

  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  return (
    <VStack alignItems="center" space={4} my={8}>
      <Image
        alt="No Data"
        source={emptyImage}
        style={{ width: width * 0.6, height: width * 0.6 }}
      />
      <Text textAlign="center" bold color={text}>
        Houve um erro ao carregar o formulário.{"\n"}
        Tente novamente!
      </Text>
    </VStack>
  );
}
