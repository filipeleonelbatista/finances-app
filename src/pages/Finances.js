import React, { useState } from 'react';

import { ScrollView, VStack, useColorModeValue, useTheme, Text, IconButton, HStack, Box, Input, Button } from 'native-base';
import { Dimensions, FlatList, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { RectButton, } from 'react-native-gesture-handler';

import { Feather, FontAwesome, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useWindowDimensions } from 'react-native';
import bgImg from '../assets/images/background.png';
import AddItemForm from '../components/AddItemForm';
import EditItemForm from '../components/EditItemForm';
import EmptyMessage from '../components/EmptyMessage';
import Modal from '../components/Modal';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';
import { useForms } from '../hooks/useForms';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import Header from '../components/Header';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Finances() {
  const theme = useTheme();

  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const bgCard = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[800]);
  const headerText = useColorModeValue('white', theme.colors.gray[800]);
  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

  const { setSelectedSheet } = useForms();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedSheet('add-finances')
    }
  }, [isFocused])

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
    selectedPeriod, setSelectedPeriod,
    filterLabels,
    pamentStatusLabel,
    selectedPaymentStatus, setSelectedPaymentStatus,
    selectedDateOrderFilter, setSelectedDateOrderFilter,
    dateOrderOptions, handleFavorite,
    selectedFavoritedFilter, setSelectedFavoritedFilter,
    favoritedFilterLabel,
    categoriesList, selectedPaymentCategory, setSelectedPaymentCategory,
    search, setSearch,
    startDate, setStartDate,
    endDate, setEndDate,
  } = usePayments();

  const { width, height } = useWindowDimensions();

  const {
    isEnableTitheCard,
    isEnableTotalHistoryCard,
    simpleFinancesItem
  } = useSettings();

  const {
    currentTheme
  } = useTheme();

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

  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [openModalSeeTransaction, setOpenModalSeeTransaction] = useState(false);
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
      <ScrollView style={styles.container}>
        <Header
          title="Finança"
          iconComponent={
            <IconButton
              size={10}
              borderRadius='full'
              icon={<Feather name="settings" size={20} color={headerText} />}
              onPress={() => navigation.navigate("Configuracoes")}
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
                <HStack justifyContent="space-between">
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
                              themeVariant: currentTheme,
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
                              themeVariant: currentTheme,
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

                {
                  !simpleFinancesItem && (
                    <>
                      <View style={styles.listRow}>
                        <Text style={{ ...styles.listTitle, fontSize: 15, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                          Categoria de gastos
                        </Text>
                        <Picker
                          selectedValue={selectedPaymentCategory}
                          onValueChange={(itemValue, itemIndex) =>
                            setSelectedPaymentCategory(itemValue)
                          }
                          mode='dropdown'
                          dropdownIconColor={'#9c44dc'}
                          dropdownIconRippleColor={'#9c44dc'}
                          enabled
                          style={{
                            width: '50%',
                            borderRadius: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21'
                          }}
                        >
                          {
                            categoriesList.map((cat, index) => (
                              <Picker.Item key={index} label={cat} value={cat} />
                            ))
                          }
                        </Picker>
                      </View>
                      <View style={styles.listRow}>
                        <Text style={{ marginBottom: 4, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Filtrar por Status de pagamento</Text>
                      </View>
                      <View style={styles.listRow}>
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
                                borderColor: item === selectedPaymentStatus ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                              }}
                              onPress={() => setSelectedPaymentStatus(item)}
                            >
                              <Text style={{
                                color: item === selectedPaymentStatus ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                              }}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                      <View style={styles.listRow}>
                        <Text style={{ marginBottom: 4, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                          Ordenar por data
                        </Text>
                      </View>
                      <View style={styles.listRow}>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                          data={dateOrderOptions}
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
                                borderColor: item === selectedDateOrderFilter ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                              }}
                              onPress={() => setSelectedDateOrderFilter(item)}
                            >
                              <Text style={{
                                color: item === selectedDateOrderFilter ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                              }}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </>
                  )
                }

                <View style={styles.listRow}>
                  <Text style={{ marginBottom: 4, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                    Favoritos
                  </Text>
                </View>
                <View style={styles.listRow}>
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
                          borderColor: item === selectedFavoritedFilter ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                        }}
                        onPress={() => setSelectedFavoritedFilter(item)}
                      >
                        <Text style={{
                          color: item === selectedFavoritedFilter ? '#9c44dc' : currentTheme === 'dark' ? '#FFF' : '#666',
                        }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

              </VStack>
            )
          }


        </VStack>

        {
          filteredList.length > 0 && (
            <View style={styles.list}>
              <TextInput
                placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                style={{
                  ...styles.input,
                  backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                  color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                  marginBottom: 4
                }}
                placeholder="Pesquise os itens..."
                onChangeText={text => setSearch(text)}
                value={search}
                editable={true}
              />
            </View>
          )
        }

        {
          filteredList.length === 0 ? <EmptyMessage /> : (
            <View style={styles.list}>
              <View style={styles.listRow}>
                <Text style={{ marginBottom: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                  Toque no item para visualizar e depois editar ou excluir.{'\n'}Segure para adicionar/remover dos favoritos
                </Text>
              </View>

              {
                filteredList.map(item => (
                  <RectButton
                    key={item.id}
                    onPress={() => {
                      setSelectedTransaction(item)
                      setOpenModalSeeTransaction(true)
                    }}
                    onLongPress={() => {
                      handleFavorite(item)
                    }}
                    style={{ ...styles.listCardItem, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF', position: 'relative' }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', position: 'absolute', top: 6, right: 8 }}>

                      {
                        !simpleFinancesItem && item.isEnabled && (
                          <View
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderWidth: 1,
                              borderRadius: 16,
                              backgroundColor: 'transparent',
                              borderColor: item.paymentStatus ? '#12a454' : '#e83e5a',
                            }}
                          >
                            <Text style={{
                              fontSize: 12,
                              color: item.paymentStatus ? '#12a454' : '#e83e5a',
                            }}>
                              {item.paymentStatus ? 'Pago' : 'Não Pago'}
                            </Text>
                          </View>
                        )
                      }
                      <FontAwesome
                        name={item.isFavorited ? "star" : "star-o"}
                        size={18}
                        color={item.isFavorited ? "#ffe234" : currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                      />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', width: '100%' }}>

                      {
                        item.isEnabled ? (
                          item.category ? categoryItemLib[item.category] : (
                            <Feather
                              name={"arrow-down-circle"}
                              size={28}
                              color={"#e83e5a"}
                            />
                          )
                        ) : (
                          <Feather
                            name={"arrow-up-circle"}
                            size={28}
                            color={"#12a454"}
                          />
                        )
                      }
                      <View style={{
                        flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                      }}>
                        <View style={{
                          flexDirection: 'row', alignItems: 'flex-start', gap: 4,
                        }}>
                          <Text style={{ ...styles.cardTextListItem, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                            {item.description}
                          </Text>
                        </View>
                        {
                          item.date !== '' && (
                            <Text style={{ ...styles.cardTextListItem, fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                              {
                                item.isEnabled ? 'Dt. Venc.: ' : "Dt. Receb.: "
                              }
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </Text>
                          )
                        }
                        {
                          !simpleFinancesItem && item.paymentDate !== '' && item.isEnabled && (
                            <Text style={{ ...styles.cardTextListItem, fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                              Dt. Pgto.: {new Date(item.paymentDate).toLocaleDateString('pt-BR')}
                            </Text>
                          )
                        }
                        {
                          !simpleFinancesItem && (
                            <Text style={{ ...styles.cardTextListItem, fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                              {'Cat.: '}
                              {
                                item.category
                              }
                            </Text>
                          )
                        }
                      </View>
                      <View style={{
                        alignItems: 'flex-end', width: '34%'
                      }}>
                        <Text style={{ ...styles.cardTextListItem, textAlign: 'right', marginTop: 20, fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                          {item.isEnabled ? "-" : ""}
                          {item.amount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                          })}
                        </Text>
                      </View>
                    </View>
                  </RectButton>
                ))
              }

              <View style={{ ...styles.listRow, paddingHorizontal: 16, }}>
                <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Total</Text>
                <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                  {listTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })}
                </Text>
              </View>
            </View>
          )
        }
        <View style={{ height: 80 }} />
      </ScrollView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    color: '#f0f2f5',
    marginVertical: 24,
  },
  ScrollViewContainer: {
    width: '100%',
    marginTop: -50,
    height: 115,
  },
  header: {
    paddingTop: 12,
    height: 130,
    width: '100%',
    backgroundColor: '#9c44dc',
  },
  headerItens: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerEmpty: {
    width: 48,
    height: 48,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButton: {
    width: 62,
    height: 62,
    borderRadius: 32,
    backgroundColor: '#543b6c',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 90,
    zIndex: 50,
    elevation: 6,
  },
  imageHeader: {
    width: 130,
    height: 30,
  },
  headerButtonText: {
    fontSize: 24,
    color: '#f0f2f5',
  },
  cardWite: {
    flexDirection: 'column',
    borderRadius: 4,
    marginHorizontal: 6,
    height: 110,
    width: 180,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
  },
  cardGreen: {
    flexDirection: 'column',
    borderRadius: 4,
    marginHorizontal: 6,
    height: 110,
    width: 180,
    backgroundColor: '#543b6c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
  },
  cardTextGreen: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: '#f0f2f5',
    marginBottom: 24,
    marginBottom: 12,
  },
  cardValueGreen: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 22,
    color: '#f0f2f5'
  },
  cardText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    marginBottom: 24,
    marginBottom: 12,
  },
  cardValue: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 22,
    color: '#363f5f'
  },
  cardTitleOrientation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusBar: {
    height: 24,
    width: '100%',
    backgroundColor: '#9c44dc',
  },
  button: {
    borderRadius: 48,
    marginHorizontal: 24,
    marginVertical: 6,
    backgroundColor: '#543b6c',
    paddingHorizontal: 48,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: '#f0f2f5',
    textAlign: 'center',
  },
  list: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
  },
  listCardItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
  },
  cardTextListItem: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
  },
  listTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  listButtonFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  listButtonFilterText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#543b6c',
  },
  input: {
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderColor: "#CCC",
    borderRadius: 4,
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 0,
  },
  buttonInputGroup: {
    width: 47,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9c44dc',
    borderColor: "#9c44dc",
    borderRadius: 8,
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 8,
  },
})