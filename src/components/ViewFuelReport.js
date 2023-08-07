import React from "react";

import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  Box,
  Button,
  Input,
  ScrollView,
  Text,
  useColorModeValue,
  useTheme,
  VStack,
} from "native-base";

export default function ViewFuelReport({ selectedValue }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  function moeda(e) {
    return Number(e).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }

  console.log("selectedValue", selectedValue);

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Visualizar abastecimento
      </Text>
      <Text color={text} mb={4}>
        Informações sobre o abastecimento.
      </Text>

      <VStack space={2}>
        <Text color={text}>Local</Text>
        <Input
          placeholder="Local"
          value={selectedValue.location}
          isDisabled={true}
        />
      </VStack>

      <VStack space={2}>
        <Text color={text}>Km Atual</Text>
        <Input
          placeholder="Km Atual"
          value={String(selectedValue.currentDistance)}
          isDisabled={true}
        />
      </VStack>

      <VStack space={2}>
        <Text color={text}>Valor do litro</Text>
        <Input
          placeholder="Valor do litro"
          value={moeda(selectedValue.unityAmount)}
          isDisabled={true}
        />
      </VStack>

      <VStack space={2}>
        <Text color={text}>Valor pago</Text>
        <Input
          placeholder="Valor pago"
          value={moeda(selectedValue.amount)}
          isDisabled={true}
        />
      </VStack>
      <VStack>
        <Text color={text}>Tipo do combustivel</Text>
        <Picker
          selectedValue={selectedValue.type ?? "Gasolina comum"}
          mode="dropdown"
          dropdownIconColor={theme.colors.purple[600]}
          dropdownIconRippleColor={theme.colors.purple[600]}
          enabled={false}
          style={{
            width: "100%",
            borderRadius: 4,
            color: text,
          }}
        >
          <Picker.Item label="Gasolina comum" value="Gasolina comum" />
          <Picker.Item label="Gasolina aditivada" value="Gasolina aditivada" />
          <Picker.Item label="Etanol" value="Etanol" />
          <Picker.Item label="Etanol aditivada" value="Etanol aditivada" />
          <Picker.Item label="Carga elétrica" value="Carga elétrica" />
          <Picker.Item label="GNV" value="GNV" />
          <Picker.Item label="Dísel" value="Dísel" />
          <Picker.Item label="Dísel-S10" value="Dísel-S10" />
          <Picker.Item label="Dísel aditivado" value="Dísel aditivado" />
        </Picker>
      </VStack>

      <VStack space={2}>
        <Text color={text}>Data de vencimento</Text>
        <Input
          placeholder="DD/MM/AAAA"
          value={new Date(selectedValue.date).toLocaleDateString("pt-BR")}
          editable={false}
          isDisabled
          rightElement={
            <Button
              size="xs"
              rounded="none"
              w="1/4"
              p={0}
              h="full"
              bgColor={theme.colors.purple[600]}
              _pressed={{
                bgColor: "purple.800",
              }}
            >
              <Feather name="calendar" size={24} color="#FFF" />
            </Button>
          }
        />
      </VStack>

      <Box h={16} w={"100%"} />
    </ScrollView>
  );
}
