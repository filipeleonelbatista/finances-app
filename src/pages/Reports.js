import React, { useMemo, useState } from 'react';

import { Dimensions, FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { differenceInCalendarDays } from 'date-fns';
import { useWindowDimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import * as Progress from 'react-native-progress';
import bgImg from '../assets/images/background.png';
import AddGoalForm from '../components/AddGoalForm';
import EditGoalForm from '../components/EditGoalForm';
import EmptyMessage from '../components/EmptyMessage';
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import { useGoals } from '../hooks/useGoals';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';

export default function Reports() {
  const { width } = useWindowDimensions();
  const {
    currentTheme
  } = useTheme();

  const {
    simpleFinancesItem
  } = useSettings();

  const {
    Incomings,
    Expenses,
    filteredList,
    selectedtypeofpayment, setselectedtypeofpayment,
    pamentStatusLabel,
    selectedPaymentStatus, setSelectedPaymentStatus,
    selectedDateOrderFilter, setSelectedDateOrderFilter,
    dateOrderOptions,
    selectedFavoritedFilter, setSelectedFavoritedFilter,
    favoritedFilterLabel,
    categoriesList, selectedPaymentCategory, setSelectedPaymentCategory,
    startDate, setStartDate,
    endDate, setEndDate,
  } = usePayments();

  const {
    GoalsList: goalsList,
    selectedTransaction, setSelectedTransaction,
  } = useGoals();

  const [openFilter, setOpenFilter] = useState(false);
  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [openModalSeeTransaction, setOpenModalSeeTransaction] = useState(false);

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

  const expensesByCatData = useMemo(() => {
    const getSum = (cat) => {
      const filteredCategoryArray = filteredList.filter(item => item.category === cat)

      let totalSelectedCat = 0.0

      for (const item of filteredCategoryArray) {
        totalSelectedCat = item.amount + totalSelectedCat
      }

      return totalSelectedCat
    }

    const data = [
      {
        name: "Cartão",
        population: getSum("Cartão"),
        color: "#2D0D45",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Moradia",
        population: getSum("Moradia"),
        color: "#391056",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Vestuário",
        population: getSum("Vestuário"),
        color: "#4F1778",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Streaming",
        population: getSum("Streaming"),
        color: "#661D9A",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Estudos",
        population: getSum("Estudos"),
        color: "#7D24BC",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Beleza",
        population: getSum("Beleza"),
        color: "#9231D8",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Emergência",
        population: getSum("Emergência"),
        color: "#9C44DC",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Outros",
        population: getSum("Outros"),
        color: "#AA5DE0",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Mercado",
        population: getSum("Mercado"),
        color: "#B16BE3",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "TV/Internet/Telefone",
        population: getSum("TV/Internet/Telefone"),
        color: "#C693EA",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Transporte",
        population: getSum("Transporte"),
        color: "#D4AEF0",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
      {
        name: "Saúde",
        population: getSum("Saúde"),
        color: "#DBBCF2",
        legendFontColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
        legendFontSize: 14
      },
    ]

    const filteredData = data.filter(item => item.population > 0)

    const sortedData = filteredData.sort((a, b) => {
      if (a.population < b.population) {
        return 1;
      } else if (a.population > b.population) {
        return -1;
      } else {
        return 0;
      }
    });

    return sortedData;

  }, [filteredList])

  const onChangeStartDate = (_, selectedDate) => {
    setStartDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  const onChangeEndDate = (_, selectedDate) => {
    setEndDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  return (
    <Menu>
      <Modal currentTheme={currentTheme} open={openModalSeeTransaction} onClose={() => setOpenModalSeeTransaction(false)}>
        <EditGoalForm onClose={() => setOpenModalSeeTransaction(false)} selectedTransaction={selectedTransaction} />
      </Modal>
      <Modal currentTheme={currentTheme} open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddGoalForm onClose={() => setOpenModalAddTransaction(false)} />
      </Modal>

      <RectButton onPress={() => setOpenModalAddTransaction(true)} style={styles.headerButton}>
        <Feather name="plus" size={24} color="#FFF" />
      </RectButton>

      <ScrollView style={styles.container}>
        <ImageBackground source={bgImg} style={styles.header}>
          <View style={styles.headerItens}>
            <View style={styles.headerEmpty} />
            <Text style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 28,
              color: currentTheme === 'dark' ? '#1c1e21' : '#FFF'
            }}>
              Relatório<Text style={{ color: '#543b6c' }}>$</Text>
            </Text>
            <View style={styles.headerEmpty} />
          </View>
        </ImageBackground>

        <View paddingHorizontal={22} style={{ alignItems: 'center' }}>

          <View style={{
            flexDirection: 'column',
            borderRadius: 4,
            marginHorizontal: 6,
            backgroundColor: '#FFF',
            paddingHorizontal: 16,
            paddingVertical: 8,
            elevation: 4,
            width: '100%',
            marginTop: -50,
            marginBottom: 22,
            backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF'
          }}>
            {
              filteredList.length === 0 ? (
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                    Sem dados para analisar
                  </Text>
                  <Text style={{ marginBottom: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21', textAlign: 'center' }}>
                    Adicione e atualize os dados em finanças para ver o relatório aqui.
                  </Text>
                </View>
              ) : (
                <>
                  <View marginBottom={16}>
                    <View style={styles.listRow}>
                      <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                        Saúde das finanças
                      </Text>
                    </View>

                    <View marginBottom={8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Feather name="arrow-up-circle" size={36} color={"#12a454"} />
                        <View>
                          <Text style={{ ...styles.cardTextListItem, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                            Ganhos
                          </Text>
                          <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                            {formatCurrency(Incomings)}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View>
                          <Text style={{ ...styles.cardTextListItem, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                            Despesas
                          </Text>
                          <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                            {formatCurrency(Expenses)}
                          </Text>
                        </View>
                        <Feather name="arrow-down-circle" size={36} color={"#e83e5a"} />
                      </View>
                    </View>
                    <Progress.Bar
                      progress={
                        (((Incomings * 100) / (Incomings + Expenses)) / 100) >= 1 ? 1 : ((Incomings * 100) / (Incomings + Expenses)) / 100
                      }
                      width={width * 0.81}
                      height={14}
                      borderRadius={16}
                      color={"#12a454"}
                      unfilledColor={"#e83e5a"}
                      borderWidth={0}
                    />
                  </View>
                </>
              )
            }

            {
              expensesByCatData.length > 0 && (
                <View position="relative">
                  <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                    Gastos por categoria
                  </Text>
                  <PieChart
                    width={width * 0.81}
                    height={width * 0.6}
                    data={expensesByCatData}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                  />
                </View>
              )
            }
          </View>


          <View style={styles.listRow}>
            <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Relatório</Text>

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
              <Text style={{ fontSize: 16, color: "#9c44dc" }}><Feather name="filter" size={18} color="#9c44dc" /> Filtros</Text>
            </TouchableOpacity>
          </View>
          {
            openFilter && (
              <>
                <View style={styles.listRow}>
                  <Text style={{ ...styles.listTitle, fontSize: 15, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                    Entradas/Saídas
                  </Text>
                  <Picker
                    selectedValue={selectedtypeofpayment}
                    onValueChange={(itemValue, itemIndex) =>
                      setselectedtypeofpayment(itemValue)
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
                    <Picker.Item label="Todas" value="0" />
                    <Picker.Item label="Entradas" value="1" />
                    <Picker.Item label="Saídas" value="2" />
                  </Picker>
                </View>


                <View style={styles.listRow}>
                  <Text style={{ marginBottom: 4, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                    Filtrar por período
                  </Text>
                </View>
                <View style={{ ...styles.listRow, alignItems: 'center', marginHorizontal: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                      style={{
                        ...styles.input,
                        width: width * 0.32,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                      }}
                      placeholder="Data inicio"
                      value={startDate}
                      editable={false}
                    />
                    <TouchableOpacity onPress={() => {
                      DateTimePickerAndroid.open({
                        themeVariant: currentTheme,
                        value: new Date(Date.now()),
                        onChange: onChangeStartDate,
                        mode: 'date',
                        is24Hour: false,
                      });
                    }} style={styles.buttonInputGroup}>
                      <Feather name="calendar" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                      style={{
                        ...styles.input,
                        width: width * 0.32,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                      }}
                      placeholder="Data Fim"
                      value={endDate}
                      editable={false}
                    />
                    <TouchableOpacity onPress={() => {
                      DateTimePickerAndroid.open({
                        themeVariant: currentTheme,
                        value: new Date(Date.now()),
                        onChange: onChangeEndDate,
                        mode: 'date',
                        is24Hour: false,
                      });
                    }} style={styles.buttonInputGroup}>
                      <Feather name="calendar" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>

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

              </>
            )
          }

          <View style={{ marginVertical: 16, height: 1, width: '100%', backgroundColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} />
          <View style={styles.listRow}>
            <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Minhas metas</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={{ marginBottom: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
              Adicione e atualize suas metas financeiras.
            </Text>
          </View>

          {
            goalsList.length === 0 && <EmptyMessage />
          }
          {
            goalsList.map((goal) => (
              <RectButton
                key={goal.id}
                onPress={() => {
                  setSelectedTransaction(goal)
                  setOpenModalSeeTransaction(true)
                }}
                style={{ ...styles.listCardItem, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF', marginBottom: 8, position: 'relative' }}
              >
                <View style={{ flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%' }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", gap: 4, width: '100%',
                  }}>
                    <Text style={{ ...styles.cardTextListItem, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                      {goal.description}
                    </Text>
                    <Text style={{ ...styles.cardTextListItem, fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                      {"Prazo: "}
                      {new Date(goal.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  }}>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 4,
                    }}>
                      <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                        {goal.amount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          useGrouping: true,
                        })}{" /"}
                      </Text>
                      <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                        {goal.currentAmount.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          useGrouping: true,
                        })}
                      </Text>
                    </View>
                    {differenceInCalendarDays(goal.date, Date.now()) <= 30 && (
                      <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                        Restam {differenceInCalendarDays(goal.date, Date.now())} dias
                      </Text>
                    )}
                  </View>
                  <Progress.Bar
                    progress={(((goal.currentAmount * 100) / goal.amount) / 100) >= 1 ? 1 : ((goal.currentAmount * 100) / goal.amount) / 100}
                    width={width * 0.81}
                    height={14}
                    borderRadius={16}
                    color={(((goal.currentAmount * 100) / goal.amount) / 100) >= 1 ? "#12a454" : "#9c44dc"}
                    unfilledColor={(((goal.currentAmount * 100) / goal.amount) / 100) >= 1 ? "#12a45466" : "#9c44dc66"}
                    borderWidth={0}
                  />
                </View>
              </RectButton>
            ))
          }
        </View>
        <View style={{ height: 80 }} />
      </ScrollView >
    </Menu >
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