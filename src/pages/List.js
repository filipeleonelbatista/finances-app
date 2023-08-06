import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  Actionsheet,
  Box,
  HStack,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text,
  useColorModeValue,
  useDisclose,
  useTheme,
  VStack,
} from "native-base";
import React, { useState } from "react";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import AIComponent from "../components/AIComponent";
import EditShoppingCartItem from "../components/EditShoppingCartItem";
import EmptyMessage from "../components/EmptyMessage";
import ErrorSheet from "../components/ErrorSheet";
import EstimativeForm from "../components/EstimativeForm";
import Header from "../components/Header";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";
import { useLists } from "../hooks/useLists";
import { usePages } from "../hooks/usePages";
import { useSettings } from "../hooks/useSettings";
import EditListForm from "../components/EditListForm";
import EditItemListItem from "../components/EdittemListtItem";
import { Picker } from "@react-native-picker/picker";

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
  const bgCardPressed = useColorModeValue(
    theme.colors.warmGray[100],
    theme.colors.gray[700]
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

  const {
    selectedCategory,
    setSelectedCategory,
    filteredList,
    selectedList,
    selectedListItems,
    listTotal,
    search,
    setSearch,
    updateItemQuantityToList,
  } = useLists();

  const [selectedSheetOpen, setSelectedSheetOpen] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { marketSimplifiedItems, isAiEnabled } = useSettings();

  return (
    <VStack flex={1} bg={bg}>
      <Header
        title="Item"
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

      <ScrollView flex={1} w={"100%"} h={"100%"}>
        <VStack p={4} space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack mb={4}>
              <Text bold fontSize={20} color={text}>
                {selectedList?.description}
              </Text>
              <Text fontSize={14} color={text}>
                Local de compra:{" "}
                {selectedList?.location === ""
                  ? "Sem mercado"
                  : selectedList?.location}
              </Text>
              <Text fontSize={14} color={text}>
                Criado em:{" "}
                {new Date(selectedList?.date).toLocaleDateString("pt-BR")}
              </Text>
            </VStack>
            <IconButton
              size={12}
              borderRadius="full"
              borderColor={theme.colors.green[500]}
              borderWidth={1}
              icon={
                <Feather
                  name="edit"
                  size={20}
                  color={theme.colors.green[500]}
                />
              }
              onPress={() => {
                setSelectedSheetOpen("editar");
                onOpen();
              }}
              _pressed={{
                bgColor: theme.colors.green[800],
              }}
            />
          </HStack>

          <HStack justifyContent="space-between" alignItems={"center"} mt={-4}>
            <Text bold fontSize={20} color={text}>
              Sua lista
            </Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
              }
              mode="dropdown"
              dropdownIconColor={theme.colors.purple[600]}
              dropdownIconRippleColor={theme.colors.purple[600]}
              enabled
              style={{
                width: "50%",
                borderRadius: 4,
                color: text,
              }}
            >
              <Picker.Item label="Todos os itens" value="Todos os itens" />
              <Picker.Item label="Carnes" value="Carnes" />
              <Picker.Item label="Fruteira" value="Fruteira" />
              <Picker.Item label="Higiêne" value="Higiêne" />
              <Picker.Item label="Limpeza" value="Limpeza" />
              <Picker.Item label="Mercearia" value="Mercearia" />
              <Picker.Item label="Outros" value="Outros" />
            </Picker>
          </HStack>

          {selectedListItems.length > 0 && (
            <Input
              placeholder="Pesquise os itens..."
              onChangeText={(text) => setSearch(text)}
              value={search}
              editable={true}
              mb={4}
            />
          )}

          <VStack space={2}>
            {filteredList.length === 0 ? (
              <EmptyMessage />
            ) : (
              filteredList.map((item, index) => (
                <Pressable
                  onPress={() => {
                    setSelectedTransaction(item);
                    setSelectedSheetOpen("editar-item");
                    onOpen();
                  }}
                  key={item.id}
                  bgColor={bgCard}
                  shadow={2}
                  borderRadius={4}
                  px={4}
                  py={2}
                  _pressed={{
                    bgColor: bgCardPressed,
                  }}
                >
                  <HStack alignItems={"center"}>
                    <HStack position={"absolute"} top={3} right={3} space={2}>
                      {!marketSimplifiedItems && (
                        <Box
                          alignItems={"center"}
                          justifyContent={"center"}
                          py={1}
                          px={2}
                          borderWidth={1}
                          borderColor={
                            item.quantityDesired <= item.quantity
                              ? theme.colors.green[600]
                              : theme.colors.red[600]
                          }
                          borderRadius={"full"}
                          bgColor={"transparent"}
                        >
                          <Text
                            fontSize={12}
                            color={
                              item.quantityDesired <= item.quantity
                                ? theme.colors.green[600]
                                : theme.colors.red[600]
                            }
                          >
                            {item.quantityDesired <= item.quantity
                              ? "Em estoque"
                              : "Em falta"}
                          </Text>
                        </Box>
                      )}
                    </HStack>
                    <HStack alignItems={"center"} flex={1} space={4}>
                      <Feather name="shopping-bag" size={28} color={text} />
                      <VStack alignItems={"flex-start"} w={"70%"}>
                        <Text color={text} fontSize={20}>
                          {item.description}
                        </Text>
                        <Text color={text} bold lineHeight={14}>
                          {item.category}
                        </Text>

                        <HStack alignItems={"center"}>
                          <Text color={text}>
                            <FontAwesome name="money" size={14} color={text} />{" "}
                            {item.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            })}{" "}
                            {marketSimplifiedItems && (
                              <FontAwesome
                                name="times"
                                size={14}
                                color={text}
                              />
                            )}
                            {marketSimplifiedItems && " " + item.quantity}
                          </Text>
                        </HStack>

                        {!marketSimplifiedItems && (
                          <HStack alignItems={"center"} space={4} my={2}>
                            <IconButton
                              size={8}
                              borderRadius="full"
                              icon={
                                <Feather
                                  name="minus"
                                  size={20}
                                  color={theme.colors.red[600]}
                                />
                              }
                              borderWidth={1}
                              borderColor={theme.colors.red[600]}
                              onPress={() =>
                                item.quantity > 0 &&
                                updateItemQuantityToList(item, false, true)
                              }
                              _pressed={{
                                bgColor: theme.colors.red[300],
                              }}
                            />
                            <Text color={text} fontSize={20}>
                              {item.quantity}
                            </Text>
                            <IconButton
                              size={8}
                              borderRadius="full"
                              icon={
                                <Feather
                                  name="plus"
                                  size={20}
                                  color={theme.colors.green[600]}
                                />
                              }
                              borderWidth={1}
                              borderColor={theme.colors.green[600]}
                              onPress={() =>
                                updateItemQuantityToList(item, true, false)
                              }
                              _pressed={{
                                bgColor: theme.colors.purple[300],
                              }}
                            />
                          </HStack>
                        )}
                      </VStack>
                    </HStack>

                    {filteredList.length > 0 && (
                      <HStack alignItems={"flex-end"} w={"35%"}>
                        <Text
                          w={"100%"}
                          numberOfLines={1}
                          textAlign={"right"}
                          color={text}
                          fontSize={18}
                        >
                          {(item.amount * item.quantity).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            }
                          )}
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                </Pressable>
              ))
            )}
          </VStack>
          {selectedListItems.length > 0 && (
            <HStack justifyContent="space-between">
              <Text color={text} fontSize={18} bold>
                Total
              </Text>
              <Text color={text} fontSize={18} bold>
                {listTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
              </Text>
            </HStack>
          )}
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
            <EditListForm onClose={onClose} />
          ) : selectedSheetOpen === "editar-item" ? (
            <EditItemListItem
              onClose={onClose}
              selectedTransaction={selectedTransaction}
            />
          ) : (
            <ErrorSheet />
          )}
          <Box h={16} w={"100%"} />
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
