import React, { useState } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Actionsheet,
  Box,
  Button,
  HStack,
  IconButton,
  Pressable,
  ScrollView,
  Text,
  useColorModeValue,
  useDisclose,
  useTheme,
  VStack,
} from "native-base";

import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import AIComponent from "../components/AIComponent";
import EditShoppingCartItem from "../components/EditShoppingCartItem";
import ErrorSheet from "../components/ErrorSheet";
import EstimativeForm from "../components/EstimativeForm";
import Header from "../components/Header";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";
import { useMarket } from "../hooks/useMarket";
import { usePages } from "../hooks/usePages";
import { useSettings } from "../hooks/useSettings";
import { useLists } from "../hooks/useLists";
import EmptyMessage from "../components/EmptyMessage";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Lists() {
  const theme = useTheme();

  const bg = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[900]
  );
  const bgCard = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[800]
  );
  const headerText = useColorModeValue("white", theme.colors.gray[800]);
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { setSelectedSheet } = usePages();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedSheet("Lists");
    }
  }, [isFocused]);

  const isKeyboardOpen = useIsKeyboardOpen();

  const { isOpen, onOpen, onClose } = useDisclose();

  const navigation = useNavigation();

  const { height } = useWindowDimensions();

  const { lists, handleSelectList, handleDeleteList } = useLists();

  const [selectedSheetOpen, setSelectedSheetOpen] = useState(null);

  return (
    <VStack flex={1} bg={bg}>
      <Header
        title="Lista"
        isShort
        isLeftIconComponent={
          <IconButton
            size={10}
            borderRadius="full"
            icon={<Feather name="arrow-left" size={20} color={headerText} />}
            onPress={() => navigation.navigate("Stock")}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          />
        }
        isRightIconComponent={
          <IconButton
            size={10}
            borderRadius="full"
            icon={<Feather name="settings" size={20} color={headerText} />}
            onPress={() => navigation.navigate("Configuracoes")}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          />
        }
      />

      <ScrollView flex={1} w={"100%"} h={"100%"}>
        <VStack p={4} space={2}>
          <Text bold fontSize={20} color={text}>
            Suas listas de compras
          </Text>
          <Text mb={4} fontSize={14} color={text}>
            Crie suas listas de compra e adicione ao estoque para seu controle.
            Pressione e segure para remover uma lista.
          </Text>

          <VStack>
            {lists.length === 0 ? (
              <EmptyMessage />
            ) : (
              lists.map((item, index) => (
                <Pressable
                  w="100%"
                  key={index}
                  bgColor={bgCard}
                  shadow={2}
                  borderRadius={4}
                  p={2}
                  my={1}
                  _pressed={{
                    bgColor: "gray.200",
                  }}
                  onPress={() => {
                    handleSelectList(item.id);
                    navigation.navigate("List");
                  }}
                  onLongPress={() => {
                    handleDeleteList(item.id);
                  }}
                >
                  <HStack alignItems="center" space={2}>
                    <Box mx={2}>
                      <Feather name={"shopping-cart"} size={28} color={text} />
                    </Box>
                    <VStack flex={1}>
                      <Text fontSize={18} color={text}>
                        {item.description}
                      </Text>
                      <Text fontSize={14} color={text}>
                        {item.location === ""
                          ? "Sem mercado definido"
                          : item.location}
                      </Text>
                      <Text fontSize={14} color={text}>
                        {item.quantity} itens
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end" width="34%">
                      <Text fontSize={18} numberOfLines={1} color={text}>
                        {item.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          useGrouping: true,
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                </Pressable>
              ))
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <AIComponent />
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        h={height * (isKeyboardOpen ? 0.9 : 1.09)}
      >
        <Actionsheet.Content pb={isKeyboardOpen ? 24 : 0}>
          {selectedSheetOpen === "editar" ? (
            <EditShoppingCartItem
              onClose={onClose}
              selectedTransaction={selectedTransaction}
            />
          ) : selectedSheetOpen === "estimativa" ? (
            <EstimativeForm onClose={onClose} />
          ) : (
            <ErrorSheet />
          )}
          <Box h={16} w={"100%"} />
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
