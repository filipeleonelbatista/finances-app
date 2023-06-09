import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSettings } from '../hooks/useSettings';

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export const PaymentsContext = createContext({});

export function PaymentsContextProvider(props) {
  const [transactionsList, setTransactionsList] = useState('');
  const { willUsePrefixToRemoveTihteSum, prefixTithe } = useSettings();
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('Todos');
  const [selectedDateOrderFilter, setSelectedDateOrderFilter] = useState('Vencimento');
  const [selectedFavoritedFilter, setSelectedFavoritedFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("DD/MM/YYYY"));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("DD/MM/YYYY"));

  const favoritedFilterLabel = [
    'Todos',
    'Favoritos',
    'Não favoritados',
  ]

  const pamentStatusLabel = [
    'Todos',
    'Pago',
    'Não Pago',
  ]

  const dateOrderOptions = [
    'Vencimento',
    'Pagamento',
  ]

  const filterLabels = [
    'Este mês',
    'Próximo mês',
    'Esta semana',
    'Próxima semana',
    'Em duas semanas',
    'Em três semanas',
    'Em quatro semanas',
    'Semana passada',
    'Duas semanas atrás',
    'Três semanas atrás',
    'Quatro semanas atrás',
    'Mês passado',
    'Todos'
  ]

  const categoriesList = [
    'Todos',
    'Outros',
    'Bares e Restaurantes',
    'Beleza',
    'Cartão',
    'Emergência',
    'Estudos',
    'Ganhos',
    'Investimentos',
    'Mercado',
    'Moradia',
    'Saúde',
    'Streaming',
    'TV/Internet/Telefone',
    'Transporte',
    'Vestuário',
  ]

  const [selectedTransaction, setSelectedTransaction] = useState();

  const [selectedtypeofpayment, setselectedtypeofpayment] = useState('0');
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês');
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState('Todos');

  const filteredList = useMemo(() => {
    if (transactionsList) {
      const filteredType = transactionsList.filter(item => {
        if (selectedtypeofpayment === '0') {
          return true;
        }
        if (selectedtypeofpayment === '1' && !item.isEnabled) {
          return true;
        }
        if (selectedtypeofpayment === '2' && item.isEnabled) {
          return true;
        }
        return false;
      })

      const filteredWords = search === '' ? filteredType : filteredType.filter(item => item.description.includes(search))

      const filteredByPeriod = filteredWords.filter(item => {
        const itemDate = dayjs(item.date)
        const currentStartDate = dayjs(`${startDate.split('/')[2]}-${startDate.split('/')[1]}-${startDate.split('/')[0]}`)
        const currentEndDate = dayjs(`${endDate.split('/')[2]}-${endDate.split('/')[1]}-${endDate.split('/')[0]}`)
        return itemDate.isSameOrAfter(currentStartDate) && itemDate.isSameOrBefore(currentEndDate)
      })

      const filteredByPaymentCategory = filteredByPeriod.filter(item => {
        if (selectedPaymentCategory === "Todos") {
          return true
        } else {
          return item.category === selectedPaymentCategory;
        }
      })

      const filteredByPaymentStatus = filteredByPaymentCategory.filter(item => {
        if (selectedPaymentStatus === "Todos") {
          return true
        }
        if (selectedPaymentStatus === "Pago") {
          return item.paymentStatus
        }
        if (selectedPaymentStatus === "Não Pago") {
          return !item.paymentStatus
        }
      })

      const filteredByFavoritedStatus = filteredByPaymentStatus.filter(item => {
        if (selectedFavoritedFilter === "Todos") {
          return true
        }
        if (selectedFavoritedFilter === "Favoritos") {
          return item.isFavorited
        }
        if (selectedFavoritedFilter === "Não favoritados") {
          return !item.isFavorited
        }
      })

      const sortedByDateArray = filteredByFavoritedStatus.sort((a, b) => {
        if (selectedDateOrderFilter === 'Vencimento') {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);

          if (dateA.isBefore(dateB)) {
            return 1;
          }

          if (dateA.isAfter(dateB)) {
            return -1;
          }

          return 0;
        }
        if (selectedDateOrderFilter === 'Pagamento') {
          const dateA = dayjs(a.paymentDate);
          const dateB = dayjs(b.paymentDate);

          if (dateA.isBefore(dateB)) {
            return 1;
          }

          if (dateA.isAfter(dateB)) {
            return -1;
          }

          return 0;
        }
        return 0;

      })

      return sortedByDateArray;
    }
    return [];
  }, [
    transactionsList,
    selectedPeriod,
    selectedtypeofpayment,
    selectedPaymentStatus,
    selectedDateOrderFilter,
    selectedFavoritedFilter,
    selectedPaymentCategory,
    search,
    startDate,
    endDate,
  ])

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      if (item.isEnabled) {
        TotalList = TotalList - item.amount
      } else {
        TotalList = TotalList + item.amount
      }
    }
    return TotalList
  }, [filteredList])

  const Saldo = useMemo(() => {
    let soma = 0.0
    for (const item of transactionsList) {
      if (item.isEnabled) {
        soma = soma - parseFloat(item.amount);
      } else {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [transactionsList])

  const Expenses = useMemo(() => {
    let soma = 0.0
    for (const item of filteredList) {
      if (item.isEnabled) {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList, selectedPeriod])

  const Incomings = useMemo(() => {
    let soma = 0.0
    for (const item of filteredList) {
      if (!item.isEnabled) {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList, selectedPeriod])

  const Total = useMemo(() => {
    let soma = 0.0
    for (const item of filteredList) {
      if (item.isEnabled) {
        soma = soma - parseFloat(item.amount);
      } else {
        soma = soma + parseFloat(item.amount);
      }
    }
    return soma;
  }, [filteredList])

  const Tithe = useMemo(() => {
    let soma = 0.0
    for (const item of filteredList) {
      if (!item.isEnabled) {
        soma = soma + item.amount
      }
      if (item.isEnabled && willUsePrefixToRemoveTihteSum) {
        if (prefixTithe != "" && item.description.includes(prefixTithe)) {
          soma = soma - item.amount
        }
      }
    }

    if (soma < 0) {
      soma = 0.0
    }

    return (soma * 10) / 100;
  }, [selectedPeriod, prefixTithe, willUsePrefixToRemoveTihteSum, filteredList])

  async function handleFavorite(currentTransaction) {
    const index = transactionsList.findIndex(item => item.id === currentTransaction.id)
    if (index !== -1) {
      const newTransactionList = transactionsList;
      newTransactionList[index].isFavorited = !currentTransaction.isFavorited;

      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

      loadTransactions()

      ToastAndroid.show((!currentTransaction.isFavorited ? 'Removido' : 'Adicionado') + ' aos favoritos', ToastAndroid.SHORT);
    }
  }

  async function updateTransaction(currentTransaction) {
    const index = transactionsList.findIndex(item => item.id === currentTransaction.id)
    if (index !== -1) {
      const newTransactionList = transactionsList;
      newTransactionList[index] = currentTransaction;

      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

      loadTransactions()

      ToastAndroid.show('Transação Atualizada', ToastAndroid.SHORT);
    }
  }

  async function deleteTransaction(currentTransaction) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => console.log('Não pressed'),
        },
        {
          text: 'Sim',
          onPress: async () => {

            const newTransactionList = transactionsList.filter(item => item.id !== currentTransaction.id);

            await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

            loadTransactions()

            ToastAndroid.show('Transação Removida', ToastAndroid.SHORT);
          },
        },
      ])
  }
  async function importTransactions(importedList) {
    const newTransactionList = [
      ...transactionsList,
      ...importedList
    ]

    await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Importação feita com sucesso', ToastAndroid.SHORT);
  }

  async function addTrasaction(newTransaction) {

    const newTransactionList = [
      ...transactionsList,
      {
        id: v4(),
        ...newTransaction
      }
    ]

    await AsyncStorage.setItem('transactions', JSON.stringify(newTransactionList));

    loadTransactions()

    ToastAndroid.show('Transação Adicionada', ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    // await AsyncStorage.clear();
    try {
      const value = await AsyncStorage.getItem('transactions');
      if (value !== null) {
        const valueArray = JSON.parse(value)
        setTransactionsList(valueArray)
      } else {
        await AsyncStorage.setItem('transactions', JSON.stringify([]));
      }
    } catch (e) {
      console.log(e)
    }

    return;

  }, [setTransactionsList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <PaymentsContext.Provider
      value={{
        transactionsList,
        setTransactionsList,
        Incomings,
        Expenses,
        Total,
        Tithe,
        Saldo,
        addTrasaction,
        updateTransaction,
        deleteTransaction,
        selectedTransaction, setSelectedTransaction,
        filteredList,
        listTotal,
        selectedtypeofpayment, setselectedtypeofpayment,
        selectedPeriod, setSelectedPeriod,
        filterLabels,
        importTransactions,
        pamentStatusLabel,
        selectedPaymentStatus, setSelectedPaymentStatus,
        selectedDateOrderFilter, setSelectedDateOrderFilter,
        dateOrderOptions,
        handleFavorite,
        selectedFavoritedFilter, setSelectedFavoritedFilter,
        favoritedFilterLabel,
        categoriesList,
        selectedPaymentCategory, setSelectedPaymentCategory,
        search, setSearch,
        startDate, setStartDate,
        endDate, setEndDate,
      }}
    >
      {props.children}
    </PaymentsContext.Provider>
  );
}
