import React, { useMemo, useState } from 'react';

import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import bgImg from '../assets/images/background.png';
import AddFuelForm from '../components/AddFuelForm';
import AutonomyForm from '../components/AutonomyForm';
import Modal from '../components/Modal';
import { useRuns } from '../hooks/useRuns';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Runs() {
  const navigation = useNavigation();

  const [selectedPeriod, setSelectedPeriod] = useState('Este mês');

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

        if (selectedPeriod === 'Todos') {
          return true;
        }
        if (selectedPeriod === 'Este mês') {
          const firstDayOfMonth = dayjs().startOf('month');
          const lastDayOfMonth = dayjs().endOf('month');
          return itemDate.isSameOrAfter(firstDayOfMonth) && itemDate.isSameOrBefore(lastDayOfMonth);
        }
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
  }, [FuelList, selectedPeriod])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + (item.amount * item.volume)
    }
    return TotalList
  }, [filteredList])

  return (
    <>
      <Modal open={openModalSetAutonomy} onClose={() => setOpenModalSetAutonomy(false)}>
        <AutonomyForm onClose={() => setOpenModalSetAutonomy(false)} />
      </Modal>
      <Modal open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddFuelForm onClose={() => setOpenModalAddTransaction(false)} />
      </Modal>
      <ScrollView style={styles.container}>
        <ImageBackground source={bgImg} style={styles.header}>
          <View style={styles.headerItens}>
            <View style={styles.headerEmpty} />
            <Text style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 24,
              color: '#FFF'
            }}>
              Corrida<Text style={{ color: '#543b6c' }}>$</Text>
            </Text>
            <RectButton onPress={() => setOpenModalAddTransaction(true)} style={styles.headerButton}>
              <Feather name="plus" size={24} color="#FFF" />
            </RectButton>
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
          <RectButton onPress={() => setOpenModalSetAutonomy(true)} style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Autonomia</Text>
              <Feather name={"arrow-up-circle"} size={48} color={"#12a454"} />
            </View>
            <Text style={styles.cardValue}>{autonomy ?? 0}L</Text>
          </RectButton>
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Km Atual</Text>
              <Feather name="arrow-up-circle" size={48} color="#12a454" />
            </View>
            <Text style={styles.cardValue}>{filteredList[0]?.currentDistance ?? 0}</Text>
          </View>
          <View style={styles.cardGreen}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardTextGreen}>Km Estimado</Text>
              <Feather name="dollar-sign" size={48} color="#FFF" />
            </View>
            <Text style={styles.cardValueGreen}>{filteredList[0] ? ((autonomy * filteredList[0]?.volume) + filteredList[0]?.currentDistance) : 0}</Text>
          </View>
        </ScrollView>

        <View style={styles.list}>
          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4, marginTop: -15 }}>* Totais referentes ao ultimo abastecimento</Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listTitle}>Abastecimentos</Text>

            <Picker
              selectedValue={selectedPeriod}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedPeriod(itemValue)
              }
              mode='dropdown'
              dropdownIconColor={'#9c44dc'}
              dropdownIconRippleColor={'#9c44dc'}
              enabled
              style={{
                width: '50%',
                borderRadius: 4,
              }}
            >
              <Picker.Item label="Este mês" value="Este mês" />
              <Picker.Item label="Todas" value="Todas" />
            </Picker>
          </View>

          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4 }}>Clique no item para excluir</Text>
          </View>

          {
            filteredList.map(item => (
              <RectButton
                key={item.id}
                onPress={() => {
                  deleteTransaction(item)
                }}
                style={styles.listCardItem}
              >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={"fuel"}
                    size={48}
                    color={"#12a454"}
                  />
                  <View style={{ flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                    <Text style={styles.cardTextListItem} >{item.location}</Text>
                    <Text style={{ ...styles.cardTextListItem, fontSize: 14 }} >
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </Text>
                    <Text style={{ ...styles.cardTextListItem, fontSize: 14 }} >
                      {item.amount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      })} - {item.volume} Litros
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardTextListItem} >
                  {item.isEnabled ? "-" : ""}
                  {(item.amount * item.volume).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })}
                </Text>
              </RectButton>
            ))
          }


          <View style={{ ...styles.listRow, paddingHorizontal: 16, }}>
            <Text style={styles.listTitle}>Total</Text>
            <Text style={styles.listTitle}>
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#f0f2f5',
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
    width: 48,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#543b6c',
    justifyContent: 'center',
    alignItems: 'center'
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
    fontSize: 28,
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
    fontSize: 28,
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
})