import React, { useState } from 'react';

import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import bgImg from '../assets/images/background.png';
import AddShoppingCartItem from '../components/AddShoppingCartItem';
import EditShoppingCartItem from '../components/EditShoppingCartItem';
import EstimativeForm from '../components/EstimativeForm';
import Menu from '../components/Menu';
import Modal from '../components/Modal';
import { useMarket } from '../hooks/useMarket';
import { useTheme } from '../hooks/useTheme';
import EmptyMessage from '../components/EmptyMessage';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default function Market() {
  const {
    currentTheme
  } = useTheme();

  const {
    handleAddFinances,
    filteredList,
    listTotal,
    selectedCategory,
    setSelectedCategory,
    selectedTransaction,
    setSelectedTransaction,
    estimative,
  } = useMarket();

  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [openModalSeeTransaction, setOpenModalSeeTransaction] = useState(false);
  const [openModalSetEstimative, setOpenModalSetEstimative] = useState(false);

  return (
    <Menu>
      <Modal open={openModalSetEstimative} onClose={() => setOpenModalSetEstimative(false)}>
        <EstimativeForm onClose={() => setOpenModalSetEstimative(false)} />
      </Modal>
      <Modal open={openModalSeeTransaction} onClose={() => setOpenModalSeeTransaction(false)}>
        <EditShoppingCartItem onClose={() => setOpenModalSeeTransaction(false)} selectedTransaction={selectedTransaction} />
      </Modal>
      <Modal open={openModalAddTransaction} onClose={() => setOpenModalAddTransaction(false)}>
        <AddShoppingCartItem onClose={() => setOpenModalAddTransaction(false)} />
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
              Compra<Text style={{ color: '#543b6c' }}>$</Text>
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
          <RectButton onPress={() => setOpenModalSetEstimative(true)} style={{ ...styles.cardWite, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}>
            <View style={styles.cardTitleOrientation}>
              <Text style={{ ...styles.cardText, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Estimativa</Text>
              <Feather name="arrow-up-circle" size={48} color="#12a454" />
            </View>
            <Text style={{ ...styles.cardValue, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
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
          </RectButton>
          <View style={{ ...styles.cardWite, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}>
            <View style={styles.cardTitleOrientation}>
              <Text style={{ ...styles.cardText, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Subtotal</Text>
              <Feather name="arrow-down-circle" size={48} color="#e83e5a" />
            </View>
            <Text style={{ ...styles.cardValue, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
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
          </View>

          <View style={styles.cardGreen}>
            <View style={styles.cardTitleOrientation}>
              <Text style={styles.cardTextGreen}>Total</Text>
              <Feather name="dollar-sign" size={48} color="#FFF" />
            </View>
            <Text style={styles.cardValueGreen}>
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
          </View>
        </ScrollView>

        <View style={styles.list}>

          <View style={styles.listRow}>
            <Text style={{ ...styles.listTitle, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Lista de compras</Text>

            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
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
              <Picker.Item label="Todos os itens" value="Todos os itens" />
              <Picker.Item label="Carnes" value="Carnes" />
              <Picker.Item label="Fruteira" value="Fruteira" />
              <Picker.Item label="Higiêne" value="Higiêne" />
              <Picker.Item label="Limpeza" value="Limpeza" />
              <Picker.Item label="Mercearia" value="Mercearia" />
              <Picker.Item label="Outros" value="Outros" />
            </Picker>
          </View>

          <View style={styles.listRow}>
            <Text style={{ marginBottom: 4, marginTop: -15, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
              Toque no item para editar ou excluir
            </Text>
          </View>
          {
            filteredList.length === 0 && <EmptyMessage />
          }
          {
            filteredList.map(item => (
              <RectButton
                onPress={() => {
                  setSelectedTransaction(item)
                  setOpenModalSeeTransaction(true)
                }}
                key={item.id}
                style={{ ...styles.listCardItem, backgroundColor: currentTheme === 'dark' ? '#3a3d42' : '#FFF' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', width: '65%' }}>
                    <Feather name="shopping-bag" size={28} color={currentTheme === 'dark' ? '#FFF' : '#1c1e21'} />
                    <View style={{
                      flexDirection: 'column', alignItems: 'flex-start', width: '90%',
                    }}>
                      <Text style={{ ...styles.cardTextListItem, lineHeight: 22, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >{item.description}</Text>
                      <Text style={{ ...styles.cardTextListItem, lineHeight: 14, fontSize: 14, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                        {item.category}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', width: '100%' }}>
                        <Text style={{ ...styles.cardTextListItem, lineHeight: 14, fontSize: 14, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                          Qtd.
                        </Text>
                        <Text style={{ ...styles.cardTextListItem, lineHeight: 20, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>{item.quantity}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{
                    alignItems: 'flex-end', width: '35%'
                  }}>
                    <Text style={{ ...styles.cardTextListItem, textAlign: 'right', fontSize: 16, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} >
                      {(item.amount * item.quantity).toLocaleString('pt-BR', {
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

        <View style={{ height: 16 }} />

        <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 18, color: currentTheme === 'dark' ? "#CCC" : "#666", }}>
          Caso queira adicionar o total como um item em finanças vá em configurações e na sessão Mercado clique em Add Total em Finanças
        </Text>

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
})