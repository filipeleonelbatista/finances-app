import React, { useMemo, useState } from 'react';

import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import bgImg from '../assets/images/background.png';
import AddFuelForm from '../components/AddFuelForm';
import AutonomyForm from '../components/AutonomyForm';
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import { useRuns } from '../hooks/useRuns';
import { useTheme } from '../hooks/useTheme';
import EmptyMessage from '../components/EmptyMessage';
import { TextInput } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useWindowDimensions } from 'react-native';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Runs() {
  const {
    currentTheme
  } = useTheme();

  const { width } = useWindowDimensions();

  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("DD/MM/YYYY"));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("DD/MM/YYYY"));

  const {
    FuelList,
    autonomy,
    deleteTransaction
  } = useRuns();

  const [openModalSetAutonomy, setOpenModalSetAutonomy] = useState(false);
  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);

  const filteredList = useMemo(() => {
    if (FuelList) {

      const filteredByPeriod = FuelList.filter(item => {
        const itemDate = dayjs(item.date)
        const currentStartDate = dayjs(`${startDate.split('/')[2]}-${startDate.split('/')[1]}-${startDate.split('/')[0]}`)
        const currentEndDate = dayjs(`${endDate.split('/')[2]}-${endDate.split('/')[1]}-${endDate.split('/')[0]}`)
        return itemDate.isSameOrAfter(currentStartDate) && itemDate.isSameOrBefore(currentEndDate)
      })

      const sortedByDateArray = filteredByPeriod.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);

        if (dateA.isBefore(dateB)) {
          return 1;
        }

        if (dateA.isAfter(dateB)) {
          return -1;
        }

        return 0;
      })

      return sortedByDateArray;
    }
    return [];
  }, [FuelList, startDate, endDate])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + item.amount
    }
    return TotalList
  }, [filteredList])

  const currentEstimative = useMemo(() => {
    const result = filteredList[0] ? ((autonomy * (filteredList[0]?.amount / filteredList[0]?.unityAmount)) + filteredList[0]?.currentDistance) : 0
    return result.toFixed(0);
  }, [filteredList, autonomy])

  const onChangeStartDate = (_, selectedDate) => {
    setStartDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  const onChangeEndDate = (_, selectedDate) => {
    setEndDate(dayjs(selectedDate).format("DD/MM/YYYY"))
  };

  return (
    <Menu>
      <Modal currentTheme={currentTheme} open={openModalSetAutonomy} onClose={() => setOpenModalSetAutonomy(false)}>
        <AutonomyForm onClose={() => setOpenModalSetAutonomy(false)} />
      </Modal>
      <Modal currentTheme={currentTheme} open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddFuelForm onClose={() => setOpenModalAddTransaction(false)} />
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
              Corrida<Text style={{ color: '#543b6c' }}>$</Text>
            </Text>
            <View style={styles.headerEmpty} />
          </View>
        </ImageBackground>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: 130,
            paddingHorizontal: 8,
          }}
          style={styles.ScrollViewContainer}
        >
          <View style={styles.cardGreen}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardTextGreen}>Km Estimado</Text>
              <Feather name="dollar-sign" size={48} color="#FFF" />
            </View>
            <Text style={styles.cardValueGreen}>{currentEstimative}</Text>
          </View>
          <RectButton onPress={() => setOpenModalSetAutonomy(true)} style={{ ...styles.cardWite, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}>
            <View style={styles.cardTitleOrientation}>
              <Text style={{ ...styles.cardText, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Autonomia</Text>
              <Feather name={"arrow-up-circle"} size={48} color={"#12a454"} />
            </View>
            <Text style={{ ...styles.cardValue, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>{autonomy ?? 0}L</Text>
          </RectButton>
          <View style={{ ...styles.cardWite, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}>
            <View style={styles.cardTitleOrientation}>
              <Text style={{ ...styles.cardText, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Km Atual</Text>
              <Feather name="arrow-up-circle" size={48} color="#12a454" />
            </View>
            <Text style={{ ...styles.cardValue, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>{filteredList[0]?.currentDistance ?? 0}</Text>
          </View>
        </ScrollView>

        <View style={styles.list}>
          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4, marginTop: -15, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>* Totais referentes ao ultimo abastecimento</Text>
          </View>

          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
              Filtrar por período
            </Text>
          </View>
          <View style={styles.listRow}>
            <View style={{ ...styles.listRow, alignItems: 'center', marginHorizontal: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                  style={{
                    ...styles.input,
                    width: width * 0.33,
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
                    width: width * 0.33,
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
          </View>

        </View>
        {
          filteredList.length === 0 ? <EmptyMessage /> : (
            <View style={styles.list}>
              <View style={styles.listRow}>
                <Text style={{ marginBottom: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Clique no item para excluir</Text>
              </View>
              {
                filteredList.map(item => (
                  <RectButton
                    key={item.id}
                    onPress={() => {
                      deleteTransaction(item)
                    }}
                    style={{ ...styles.listCardItem, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}
                  >
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', width: '100%' }}>
                      <MaterialCommunityIcons
                        name={"fuel"}
                        size={28}
                        color={"#12a454"}
                      />
                      <View style={{
                        flexDirection: 'column', alignItems: 'flex-start', width: '50%',
                      }}>
                        <Text style={{ ...styles.cardTextListItem, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >{item.location}</Text>
                        <Text style={{ ...styles.cardTextListItem, fontSize: 14, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                          Km no Abast.: {item.currentDistance}
                        </Text>
                        <Text style={{ ...styles.cardTextListItem, fontSize: 14, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </Text>
                        <Text style={{ ...styles.cardTextListItem, fontSize: 12, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                          {item.unityAmount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                          })} - {(item.amount / item.unityAmount).toFixed(2)} Litros
                        </Text>
                      </View>
                      <View style={{
                        alignItems: 'flex-end', width: '34%'
                      }}>
                        <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
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
    </Menu>
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