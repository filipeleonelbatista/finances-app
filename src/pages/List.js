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

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function List() {
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
      setSelectedSheet("List");
    }
  }, [isFocused]);

  const isKeyboardOpen = useIsKeyboardOpen();

  const { isOpen, onOpen, onClose } = useDisclose();

  const navigation = useNavigation();

  const { height } = useWindowDimensions();

  const { marketSimplifiedItems } = useSettings();

  const {
    filteredList,
    listTotal,
    selectedCategory,
    setSelectedCategory,
    selectedTransaction,
    setSelectedTransaction,
    estimative,
    search,
    setSearch,
    updateStock,
  } = useMarket();

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
            onPress={() => navigation.navigate("Lists")}
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
