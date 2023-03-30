import React, { useState } from 'react';

import { Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import bgImg from '../assets/images/background.png';
import logo from '../assets/images/logo.png';
import AddItemForm from '../components/AddItemForm';
import EditItemForm from '../components/EditItemForm';
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Finances() {
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
    filterLabels
  } = usePayments();

  const {
    isEnableTitheCard
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

  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [openModalSeeTransaction, setOpenModalSeeTransaction] = useState(false);


  return (
    <Menu>
      <Modal open={openModalSeeTransaction} onClose={() => setOpenModalSeeTransaction(false)}>
        <EditItemForm onClose={() => setOpenModalSeeTransaction(false)} selectedTransaction={selectedTransaction} />
      </Modal>
      <Modal open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddItemForm onClose={() => setOpenModalAddTransaction(false)} />
      </Modal>

      <RectButton onPress={() => setOpenModalAddTransaction(true)} style={styles.headerButton}>
        <Feather name="plus" size={24} color="#FFF" />
      </RectButton>

      <ScrollView style={styles.container}>
        <ImageBackground source={bgImg} style={styles.header}>
          <View style={styles.headerItens}>
            <View style={styles.headerEmpty} />
            <Image source={logo} style={styles.imageHeader} />
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
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Saldo</Text>
              <Feather name={Saldo > 0 ? "arrow-up-circle" : "arrow-down-circle"} size={48} color={Saldo > 0 ? "#12a454" : "#e83e5a"} />
            </View>
            <Text style={styles.cardValue}>{formatCurrency(Saldo)}</Text>
          </View>
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Entradas</Text>
              <Feather name="arrow-up-circle" size={48} color="#12a454" />
            </View>
            <Text style={styles.cardValue}>{formatCurrency(Incomings)}</Text>
          </View>
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Saídas</Text>
              <Feather name="arrow-down-circle" size={48} color="#e83e5a" />
            </View>
            <Text style={styles.cardValue}>-{formatCurrency(Expenses)}</Text>
          </View>
          <View style={styles.cardGreen}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardTextGreen}>Total</Text>
              <Feather name="dollar-sign" size={48} color="#FFF" />
            </View>
            <Text style={styles.cardValueGreen}>{formatCurrency(Total)}</Text>
          </View>
          {
            isEnableTitheCard && (
              <View style={styles.cardGreen}>
                <View style={styles.cardTitleOrientation}>
                  <Text style={styles.cardTextGreen}>Dízimo</Text>
                  <Feather name="dollar-sign" size={48} color="#FFF" />
                </View>
                <Text style={styles.cardValueGreen}>{formatCurrency(Tithe)}</Text>
              </View>
            )
          }
        </ScrollView>

        <View style={styles.list}>
          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4, marginTop: -15 }}>* Totais apenas dos itens do mês atual</Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listTitle}>Extrato</Text>

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
                borderRadius: 4,
              }}
            >
              <Picker.Item label="Todas" value="0" />
              <Picker.Item label="Entradas" value="1" />
              <Picker.Item label="Saídas" value="2" />
            </Picker>
          </View>

          <View style={styles.listRow}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              data={filterLabels}
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
                    borderColor: item === selectedPeriod ? '#9c44dc' : '#666',
                  }}
                  onPress={() => setSelectedPeriod(item)}
                >
                  <Text style={{
                    color: item === selectedPeriod ? '#9c44dc' : '#666',
                  }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4 }}>Clique no item para ver os detalhes</Text>
          </View>

          {
            filteredList.map(item => (
              <RectButton
                key={item.id}
                onPress={() => {
                  setSelectedTransaction(item)
                  setOpenModalSeeTransaction(true)
                }}
                style={styles.listCardItem}
              >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Feather
                    name={item.isEnabled ? "arrow-down-circle" : "arrow-up-circle"}
                    size={48}
                    color={item.isEnabled ? "#e83e5a" : "#12a454"}
                  />
                  <View style={{ flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                    <Text style={styles.cardTextListItem} >{item.description}</Text>
                    <Text style={{ ...styles.cardTextListItem, fontSize: 14 }} >{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
                  </View>
                </View>
                <Text style={styles.cardTextListItem} >
                  {item.isEnabled ? "-" : ""}
                  {item.amount.toLocaleString('pt-BR', {
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
    </Menu>
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