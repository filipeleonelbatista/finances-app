import React, { useState } from 'react';

import { Actionsheet, Box, Button, HStack, IconButton, Input, KeyboardAvoidingView, Pressable, ScrollView, Text, VStack, useColorModeValue, useDisclose, useTheme } from 'native-base';
import { FlatList, TouchableOpacity, View } from 'react-native';

import { Feather, FontAwesome, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import EditItemForm from '../components/EditItemForm';
import EmptyMessage from '../components/EmptyMessage';
import Header from '../components/Header';
import { usePages } from '../hooks/usePages';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Finances() {
  const theme = useTheme();

  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const bgCard = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[800]);
  const headerText = useColorModeValue('white', theme.colors.gray[800]);
  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

  const { setSelectedSheet } = usePages();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedSheet('Finanças')
    }
  }, [isFocused])

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  const navigation = useNavigation();

  const {
    Incomings,
    Expenses,
    Total,
    Saldo,
    Tithe,
    selectedTransaction, setSelectedTransaction,
    filteredList,
    listTotal,
    selectedtypeofpayment, setselectedtypeofpayment,
    pamentStatusLabel,
    selectedPaymentStatus, setSelectedPaymentStatus,
    handleFavorite,
    selectedFavoritedFilter, setSelectedFavoritedFilter,
    favoritedFilterLabel,
    categoriesList, selectedPaymentCategory, setSelectedPaymentCategory,
    search, setSearch,
    startDate, setStartDate,
    endDate, setEndDate,
  } = usePayments();

  const { height } = useWindowDimensions();

  const {
    isEnableTitheCard,
    isEnableTotalHistoryCard,
    simpleFinancesItem
  } = useSettings();

  const formatCurrency = (value) => {
    return value
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })
  }

  const [openFilter, setOpenFilter] = useState(false);

  const categoryItemLib = {
    'Outros': <Feather name="dollar-sign" size={28} color={"#e83e5a"} />,
    'Moradia': <Feather name="home" size={28} color={"#e83e5a"} />,
    'Vestuário': <Ionicons name="shirt-outline" size={28} color={"#e83e5a"} />,
    'Streaming': <Fontisto name="netflix" size={28} color={"#e83e5a"} />,
    'Estudos': <Ionicons name="school-outline" size={28} color={"#e83e5a"} />,
    'Beleza': <MaterialCommunityIcons name="lipstick" size={28} color={"#e83e5a"} />,
    'Emergência': <MaterialCommunityIcons name="alarm-light-outline" size={28} color={"#e83e5a"} />,
    'Mercado': <Feather name="shopping-cart" size={28} color={"#e83e5a"} />,
    'TV/Internet/Telefone': <Feather name="at-sign" size={28} color={"#e83e5a"} />,
    'Transporte': <FontAwesome name="car" size={28} color={"#e83e5a"} />,
    'Saúde': <FontAwesome name="medkit" size={28} color={"#e83e5a"} />,
    'Cartão': <Feather name="credit-card" size={28} color={"#e83e5a"} />,
    'Bares e Restaurantes': <Feather name="coffee" size={28} color={"#e83e5a"} />,
    'Ganhos': <Feather name="dollar-sign" size={28} color={"#12a454"} />,
    'Investimentos': <FontAwesome name="line-chart" size={28} color={"#12a454"} />,
  }

  const onChangeStartDate = (_, selectedDate) => {
    setStartDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  const onChangeEndDate = (_, selectedDate) => {
    setEndDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  return (
    <VStack flex={1} bg={bg}>
      <ScrollView flex={1} w={'100%'} h={'100%'}>
        <Header
          title="Finança"
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
          {
            isEnableTotalHistoryCard && (
              <VStack mx={1} shadow={2} bg={bgCard} minW={180} h={110} borderRadius={4} p={4}>
                <HStack justifyContent="space-between">
                  <Text
                    color={text}
                    fontSize={18}
                  >
                    Entradas
                  </Text>
                  <Feather name={Saldo > 0 ? "arrow-up-circle" : "arrow-down-circle"} size={48} color={theme.colors.green[500]} />
                </HStack>
                <Text color={text} fontSize={Saldo < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
                  {formatCurrency(Saldo)}
                </Text>
              </VStack>
            )
          }

          <VStack mx={1} shadow={2} bg={bgCard} minW={180} h={110} borderRadius={4} p={4}>
            <HStack justifyContent="space-between">
              <Text
                color={text}
                fontSize={18}
              >
                Entradas
              </Text>
              <Feather name="arrow-up-circle" size={48} color={theme.colors.green[500]} />
            </HStack>
            <Text color={text} fontSize={Incomings < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
              {formatCurrency(Incomings)}
            </Text>
          </VStack>

          <VStack mx={1} shadow={2} bg={bgCard} minW={180} h={110} borderRadius={4} p={4}>
            <HStack justifyContent="space-between">
              <Text
                color={text}
                fontSize={18}
              >
                Saídas
              </Text>
              <Feather name="arrow-down-circle" size={48} color={theme.colors.red[500]} />
            </HStack>
            <Text color={text} fontSize={Expenses < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
              {formatCurrency(Expenses)}
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
            <Text color={"white"} fontSize={Total < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
              {formatCurrency(Total)}
            </Text>
          </VStack>

          {
            isEnableTitheCard && (
              <VStack mx={1} shadow={2} bg={theme.colors.purple[900]} minW={180} h={110} borderRadius={4} p={4}>
                <HStack justifyContent="space-between">
                  <Text
                    color={"white"}
                    fontSize={18}
                  >
                    Dízimo
                  </Text>
                  <Feather name="dollar-sign" size={48} color={"white"} />
                </HStack>
                <Text color={"white"} fontSize={Tithe < 10000 ? 26 : 20} numberOfLines={1} maxW={170}>
                  {formatCurrency(Tithe)}
                </Text>
              </VStack>
            )
          }
        </ScrollView>

        <VStack px={4} mt={-36} space={4}>
          <Text
            fontSize={14}
            color={text}
          >
            * Totais apenas dos itens do período selecionado
          </Text>
          <HStack justifyContent="space-between">
            <Text
              bold
              fontSize={20}
              color={text}
            >
              Extrato
            </Text>
            <TouchableOpacity
              onPress={() => {
                setOpenFilter(!openFilter)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 28,
                paddingVertical: 6,
                borderWidth: 1,
                borderRadius: 20,
                backgroundColor: 'transparent',
                borderColor: '#9c44dc',
              }}
            >
              <Text fontSize={16} color={theme.colors.purple[600]}><Feather name="filter" size={18} color={theme.colors.purple[600]} /> Filtros</Text>
            </TouchableOpacity>
          </HStack>
          {
            openFilter && (
              <VStack space={2}>
                <VStack space={2}>
                  <Text color={text} fontSize={16} bold>
                    Filtrar por período
                  </Text>
                  <HStack w={"100%"} space={2}>
                    <Input
                      flex={1}
                      type={"text"}
                      py="0"
                      placeholder="Data inicio"
                      value={startDate}
                      editable={false}
                      InputRightElement={
                        <Button
                          size="xs"
                          rounded="none"
                          w="1/4"
                          p={0}
                          h="full"
                          bgColor={theme.colors.purple[600]}
                          onPress={() => {
                            DateTimePickerAndroid.open({
                              value: new Date(Date.now()),
                              onChange: onChangeStartDate,
                              mode: 'date',
                              is24Hour: false,
                            });
                          }}
                        >
                          <Feather name="calendar" size={24} color="#FFF" />
                        </Button>}
                    />
                    <Input
                      flex={1}
                      type={"text"}
                      py="0"
                      placeholder="Data Fim"
                      value={endDate}
                      editable={false}
                      InputRightElement={
                        <Button
                          size="xs"
                          rounded="none"
                          w="1/4"
                          p={2}
                          h="full"
                          bgColor={theme.colors.purple[600]}
                          onPress={() => {
                            DateTimePickerAndroid.open({
                              value: new Date(Date.now()),
                              onChange: onChangeEndDate,
                              mode: 'date',
                              is24Hour: false,
                            });
                          }}
                        >
                          <Feather name="calendar" size={24} color="#FFF" />
                        </Button>}
                    />
                  </HStack>
                </VStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={text} fontSize={16} bold>
                    Entradas/Saídas
                  </Text>
                  <Picker
                    selectedValue={selectedtypeofpayment}
                    onValueChange={(itemValue, itemIndex) =>
                      setselectedtypeofpayment(itemValue)
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
                    <Picker.Item label="Todas" value="0" />
                    <Picker.Item label="Entradas" value="1" />
                    <Picker.Item label="Saídas" value="2" />
                  </Picker>
                </HStack>
                {
                  !simpleFinancesItem && (
                    <>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text color={text} fontSize={16} bold>
                          Categoria de gastos
                        </Text>
                        <Picker
                          selectedValue={selectedPaymentCategory}
                          onValueChange={(itemValue, itemIndex) =>
                            setSelectedPaymentCategory(itemValue)
                          }
                          mode='dropdown'
                          dropdownIconColor={theme.colors.purple[600]}
                          dropdownIconRippleColor={theme.colors.purple[600]}
                          enabled
                          style={{
                            width: '50%',
                            borderRadius: 4, color: text
                          }}
                        >
                          {
                            categoriesList.map((cat, index) => (
                              <Picker.Item key={index} label={cat} value={cat} />
                            ))
                          }
                        </Picker>
                      </HStack>

                      <VStack space={2}>
                        <Text color={text} fontSize={16} bold>
                          Status de pagamento
                        </Text>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                          data={pamentStatusLabel}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderWidth: 1,
                                borderRadius: 16,
                                backgroundColor: 'transparent',
                                borderColor: item === selectedPaymentStatus ? theme.colors.purple[600] : text,
                              }}
                              onPress={() => setSelectedPaymentStatus(item)}
                            >
                              <Text color={item === selectedPaymentStatus ? theme.colors.purple[600] : text}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </VStack>
                    </>
                  )
                }

                <VStack>
                  <Text color={text} fontSize={16} bold>
                    Favoritos
                  </Text>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                    data={favoritedFilterLabel}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderWidth: 1,
                          borderRadius: 16,
                          backgroundColor: 'transparent',
                          borderColor: item === selectedFavoritedFilter ? theme.colors.purple[600] : text,
                        }}
                        onPress={() => setSelectedFavoritedFilter(item)}
                      >
                        <Text color={item === selectedFavoritedFilter ? theme.colors.purple[600] : text}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </VStack>
              </VStack>
            )}
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
            <VStack space={4} px={4} mt={2} mb={6}>
              <Text color={text}>
                Toque no item para visualizar e depois editar ou excluir.{'\n'}Segure para adicionar/remover dos favoritos
              </Text>

              {
                filteredList.map(item => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setSelectedTransaction(item)
                      onOpen()
                    }}
                    onLongPress={() => {
                      handleFavorite(item)
                    }}
                  >

                    <HStack
                      alignItems='center'
                      w='100%'
                      space={2}
                      bgColor={bgCard}
                      shadow={2}
                      borderRadius={4}
                      p={2}
                    >


                      <HStack
                        position={"absolute"}
                        top={3}
                        right={3}
                        space={2}
                      >

                        {
                          !simpleFinancesItem && item.isEnabled && (
                            <Box
                              alignItems={"center"}
                              justifyContent={"center"}
                              py={1}
                              px={2}
                              borderWidth={1}
                              borderColor={item.paymentStatus ? theme.colors.green[600] : theme.colors.red[600]}
                              borderRadius={'full'}
                              bgColor={'transparent'}
                            >
                              <Text
                                fontSize={12}
                                color={item.paymentStatus ? theme.colors.green[600] : theme.colors.red[600]}
                              >
                                {item.paymentStatus ? 'Pago' : 'Não Pago'}
                              </Text>
                            </Box>
                          )
                        }
                        <FontAwesome
                          name={item.isFavorited ? "star" : "star-o"}
                          size={18}
                          color={item.isFavorited ? theme.colors.yellow[400] : text}
                        />
                      </HStack>
                      <HStack
                        w={'100%'}
                        alignItems={"center"}
                        space={4}
                      >

                        {
                          item.isEnabled ? (
                            item.category ? categoryItemLib[item.category] : (
                              <Feather
                                name={"arrow-down-circle"}
                                size={28}
                                color={theme.colors.red[600]}
                              />
                            )
                          ) : (
                            <Feather
                              name={"arrow-up-circle"}
                              size={28}
                              color={theme.colors.green[600]}
                            />
                          )
                        }
                        <VStack
                          alignItems='flex-start'
                          flex={1}
                        >
                          <Text fontSize={18} color={text}>
                            {item.description}
                          </Text>
                          {
                            item.date !== '' && (
                              <Text color={text} >
                                {
                                  item.isEnabled ? 'Dt. Venc.: ' : "Dt. Receb.: "
                                }
                                {new Date(item.date).toLocaleDateString('pt-BR')}
                              </Text>
                            )
                          }
                          {
                            !simpleFinancesItem && item.paymentDate !== '' && item.isEnabled && (
                              <Text color={text}>
                                Dt. Pgto.: {new Date(item.paymentDate).toLocaleDateString('pt-BR')}
                              </Text>
                            )
                          }
                          {
                            !simpleFinancesItem && (

                              <Text color={text}>
                                {'Cat.: '}
                                {
                                  item.category
                                }
                              </Text>
                            )
                          }
                        </VStack>
                        <VStack
                          alignItems='flex-end' width='34%'
                        >
                          <Text
                            fontSize={18}
                            numberOfLines={1}
                            color={text}
                            mt={4}
                            mr={3}
                          >
                            {item.isEnabled ? "-" : ""}
                            {item.amount.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            })}
                          </Text>
                        </VStack>
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
          )
        }
      </ScrollView >

      <KeyboardAvoidingView
        behavior={"height"}
      >
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
          <Actionsheet.Content minH={height * 0.8}>
            <EditItemForm onClose={onClose} selectedTransaction={selectedTransaction} />
          </Actionsheet.Content>
        </Actionsheet>
      </KeyboardAvoidingView>
    </VStack >
  );
}