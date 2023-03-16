import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';

import bgImg from '../assets/images/background.png';
import logo from '../assets/images/logo.png';
import AddItemForm from '../components/AddItemForm';
import Modal from '../components/Modal';
import { usePayments } from '../hooks/usePayments';

export default function Finances() {
  const [currentTransactions, setCurrentTransactions] = useState()

  const {
    transactionsList,
    Incomings,
    Expenses,
    Total
  } = usePayments();

  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);

  useEffect(() => {
    if (transactionsList != '') {
      setCurrentTransactions(JSON.parse(transactionsList))
    }
  }, [])

  return (
    <>
      <Modal open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddItemForm onClose={() => setOpenModalAddTransaction(false)} />
      </Modal>
      <ScrollView style={styles.container}>
        <ImageBackground source={bgImg} style={styles.header}>
          <View style={styles.headerItens}>
            <View style={styles.headerEmpty} />
            <Image source={logo} style={styles.imageHeader} />
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
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Entradas</Text>
              <Feather name="arrow-up-circle" size={48} color="#12a454" />
            </View>
            <Text style={styles.cardValue}>{Incomings}</Text>
          </View>
          <View style={styles.cardWite}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardText}>Saídas</Text>
              <Feather name="arrow-down-circle" size={48} color="#e83e5a" />
            </View>
            <Text style={styles.cardValue}>{Expenses}</Text>
          </View>
          <View style={styles.cardGreen}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardTextGreen}>Total</Text>
              <Feather name="dollar-sign" size={48} color="#FFF" />
            </View>
            <Text style={styles.cardValueGreen}>{Total}</Text>
          </View>
        </ScrollView>

        <View style={styles.list}>
          <View style={styles.listRow}>
            <Text style={styles.listTitle}>Extrato</Text>
            <TouchableOpacity style={styles.listButtonFilter}>
              <Text style={styles.listButtonFilterText}>Filtrar por</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4 }}>Clique no item para ver os detalhes</Text>
          </View>


          {
            currentTransactions && currentTransactions.length > 0 ? currentTransactions.map(item => (
              <TouchableOpacity key={item.id} style={styles.listCardItem}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Feather
                    name={item.isEnabled ? "arrow-down-circle" : "arrow-up-circle"}
                    size={48}
                    color={item.isEnabled ? "#e83e5a" : "12a454"}
                  />
                  <Text style={styles.cardTextListItem} >{item.description}</Text>
                </View>
                <Text style={styles.cardTextListItem} >R$ {item.amount.tofixed(2)}</Text>
              </TouchableOpacity>
            ))
              : (
                <ActivityIndicator />
              )
          }

          <View style={styles.listRow}>
            <Text style={styles.listTitle}>Balanço atual</Text>
            <Text style={styles.listTitle}>R$ 2345,88</Text>
          </View>

          <RectButton onPress={() => {
            console.log("Olha isso", transactionsList)
          }} style={{ ...styles.button, marginTop: 32 }}>
            <Text style={{ ...styles.buttonText, fontWeight: 'bold' }} >Exportar em CSV</Text>
          </RectButton>


          <TouchableOpacity onPress={() => navigation.navigate('AboutUs')} style={styles.listButtonFilter}>
            <Text style={styles.listButtonFilterText}>Sobre o app</Text>
          </TouchableOpacity>

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
    flexDirection: 'row',
    width: "100%",
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