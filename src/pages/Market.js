import React, { useState } from 'react';

import { Feather, FontAwesome } from '@expo/vector-icons';
import { Actionsheet, Box, HStack, IconButton, Input, KeyboardAvoidingView, Pressable, ScrollView, Text, VStack, useColorModeValue, useDisclose, useTheme } from 'native-base';

import { Picker } from '@react-native-picker/picker';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import EditShoppingCartItem from '../components/EditShoppingCartItem';
import EmptyMessage from '../components/EmptyMessage';
import ErrorSheet from '../components/ErrorSheet';
import EstimativeForm from '../components/EstimativeForm';
import Header from '../components/Header';
import { useMarket } from '../hooks/useMarket';
import { usePages } from '../hooks/usePages';
import { useSettings } from '../hooks/useSettings';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Market() {
  const theme = useTheme();

  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const bgCard = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[800]);
  const headerText = useColorModeValue('white', theme.colors.gray[800]);
  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

  const { setSelectedSheet } = usePages();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedSheet('Mercado')
    }
  }, [isFocused])

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

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
    search, setSearch,
    updateStock
  } = useMarket();

  const [selectedSheetOpen, setSelectedSheetOpen] = useState(null);

  return (
    <VStack flex={1} bg={bg}>
      <ScrollView flex={1} w={'100%'} h={'100%'}>
        <Header
          title="Compra"
          iconComponent={
            <IconButton
              size={10}
              borderRadius='full'
              icon={<Feather name="settings" size={20} color={headerText} />}
              onPress={() => navigation.navigate("Configuracoes")}
              _pressed={{
                bgColor: theme.colors.purple[900]
              }}
            />
          }
        />

        <ScrollView
          horizontal
          w={'100%'}
          mt={-50}
          h={150}
          ItemSeparatorComponent={() => <Box m={2} />}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{
            height: 130,
            paddingHorizontal: 8,
          }}
        >
          <Pressable
            onPress={() => {
              setSelectedSheetOpen('estimativa')
              onOpen()
            }}
          >
            <VStack mx={1} shadow={2} bg={bgCard} minW={180} h={110} borderRadius={4} p={4}>
              <HStack justifyContent="space-between">
                <Text
                  color={text}
                  fontSize={18}
                >
                  Estimativa
                </Text>
                <Feather name="arrow-up-circle" size={48} color={theme.colors.green[500]} />
              </HStack>
              <Text color={text} fontSize={estimative < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
                {
                  estimative.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })
                }
              </Text>
            </VStack>
          </Pressable>

          <VStack mx={1} shadow={2} bg={bgCard} minW={180} h={110} borderRadius={4} p={4}>
            <HStack justifyContent="space-between">
              <Text
                color={text}
                fontSize={18}
              >
                Subtotal
              </Text>
              <Feather name="arrow-down-circle" size={48} color={theme.colors.red[500]} />
            </HStack>
            <Text color={text} fontSize={listTotal < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
              {
                listTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              }
            </Text>
          </VStack>

          <VStack mx={1} shadow={2} bg={theme.colors.purple[900]} minW={180} h={110} borderRadius={4} p={4}>
            <HStack justifyContent="space-between">
              <Text
                color={"white"}
                fontSize={18}
              >
                Total
              </Text>
              <Feather name="dollar-sign" size={48} color={"white"} />
            </HStack>
            <Text color={"white"} fontSize={(estimative - listTotal) < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
              {
                (estimative - listTotal).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              }
            </Text>
          </VStack>
        </ScrollView>

        <VStack px={4} mt={-36} space={4}>
          <Text
            fontSize={14}
            color={text}
          >
            * Toque em estimativa para definir um limite de gastos
          </Text>
          <HStack justifyContent="space-between" alignItems={"center"} mt={-4}>
            <Text
              bold
              fontSize={20}
              color={text}
            >
              Lista de compras
            </Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
              }
              mode='dropdown'
              dropdownIconColor={theme.colors.purple[600]}
              dropdownIconRippleColor={theme.colors.purple[600]}
              enabled
              style={{
                width: '50%',
                borderRadius: 4,
                color: text
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
        </VStack>

        {
          filteredList.length > 0 && (
            <Input
              placeholder="Pesquise os itens..."
              onChangeText={text => setSearch(text)}
              value={search}
              editable={true}
              mx={4}
              mt={2}
            />
          )
        }

        {
          filteredList.length === 0 ? <EmptyMessage /> : (
            <>
              <VStack space={4} px={4} mt={2} mb={6}>
                <Text color={text}>
                  Toque no item para visualizar e depois editar ou excluir.
                </Text>
                {
                  filteredList.map(item => (
                    <Pressable
                      onPress={() => {
                        setSelectedTransaction(item)
                        setSelectedSheetOpen('editar')
                        onOpen()
                      }}
                      key={item.id}
                    >
                      <HStack
                        alignItems={"center"}
                        bgColor={bgCard}
                        shadow={2}
                        borderRadius={4}
                        px={4}
                        py={2}
                      >
                        <HStack
                          position={"absolute"}
                          top={3}
                          right={3}
                          space={2}
                        >
                          {
                            !marketSimplifiedItems && (
                              <Box
                                alignItems={"center"}
                                justifyContent={"center"}
                                py={1}
                                px={2}
                                borderWidth={1}
                                borderColor={item.quantityDesired <= item.quantity ? theme.colors.green[600] : theme.colors.red[600]}
                                borderRadius={'full'}
                                bgColor={'transparent'}
                              >
                                <Text
                                  fontSize={12}
                                  color={item.quantityDesired <= item.quantity ? theme.colors.green[600] : theme.colors.red[600]}
                                >
                                  {item.quantityDesired <= item.quantity ? 'Em estoque' : 'Em falta'}
                                </Text>
                              </Box>
                            )
                          }
                        </HStack>
                        <HStack
                          alignItems={"center"}
                          flex={1}
                          space={4}
                        >
                          <Feather name="shopping-bag" size={28} color={text} />
                          <VStack
                            alignItems={"flex-start"}
                            w={'70%'}
                          >
                            <Text color={text} fontSize={20}>{item.description}</Text>
                            <Text color={text} bold lineHeight={14}>
                              {item.category}
                            </Text>

                            <HStack alignItems={"center"}>
                              <Text color={text}>
                                <FontAwesome name="money" size={14} color={text} /> {" "}
                                {item.amount.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                  useGrouping: true,
                                })} {" "}
                                {marketSimplifiedItems && (<FontAwesome name="times" size={14} color={text} />)}
                                {marketSimplifiedItems && " " + item.quantity}

                              </Text>
                            </HStack>

                            {
                              !marketSimplifiedItems && (
                                <HStack alignItems={"center"} space={4} my={2}>
                                  <IconButton
                                    size={8}
                                    borderRadius='full'
                                    icon={<Feather name="minus" size={20} color={theme.colors.red[600]} />}
                                    borderWidth={1}
                                    borderColor={theme.colors.red[600]}
                                    onPress={() => item.quantity > 0 && updateStock(item)}
                                    _pressed={{
                                      bgColor: theme.colors.red[300]
                                    }}
                                  />
                                  <Text color={text} fontSize={20}>{item.quantity}</Text>
                                  <IconButton
                                    size={8}
                                    borderRadius='full'
                                    icon={<Feather name="plus" size={20} color={theme.colors.green[600]} />}
                                    borderWidth={1}
                                    borderColor={theme.colors.green[600]}
                                    onPress={() => updateStock(item, true)}
                                    _pressed={{
                                      bgColor: theme.colors.purple[300]
                                    }}
                                  />
                                </HStack>
                              )
                            }
                          </VStack>
                        </HStack>

                        <HStack
                          alignItems={"flex-end"}
                          w={'35%'}
                        >
                          <Text
                            w={'100%'}
                            numberOfLines={1}
                            textAlign={'right'} color={text} fontSize={18}>
                            {(item.amount * item.quantity).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            })}
                          </Text>
                        </HStack>
                      </HStack>
                    </Pressable>
                  ))
                }

                <HStack justifyContent="space-between">
                  <Text color={text} fontSize={18} bold >Total</Text>
                  <Text color={text} fontSize={18} bold >
                    {listTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </Text>
                </HStack>
              </VStack>

              <Text color={text} fontSize={14} px={4} lineHeight={16} mb={8}>
                Caso queira adicionar o total como um item em finanças vá em configurações e na sessão Mercado clique em Add Total em Finanças
              </Text>
            </>
          )
        }

      </ScrollView>
      <KeyboardAvoidingView
        behavior={"height"}
      >
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
          <Actionsheet.Content minH={height * 0.8}>
            {
              selectedSheetOpen === 'editar'
                ? <EditShoppingCartItem onClose={onClose} selectedTransaction={selectedTransaction} />
                : selectedSheetOpen === 'estimativa'
                  ? <EstimativeForm onClose={onClose} />
                  : <ErrorSheet />
            }
          </Actionsheet.Content>
        </Actionsheet>
      </KeyboardAvoidingView>
    </VStack >
  );
}