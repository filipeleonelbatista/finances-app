import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { v4 } from 'uuid';

export const GoalsContext = createContext({});

export function GoalsContextProvider(props) {

  const [GoalsList, setGoalsList] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState();

  async function addTrasaction(newGoal) {
    const newGoalList = [
      ...GoalsList,
      {
        id: v4(),
        ...newGoal
      }
    ]
    await AsyncStorage.setItem('goals', JSON.stringify(newGoalList));

    loadData()

    ToastAndroid.show('Meta Adicionada', ToastAndroid.SHORT);
  }

  async function updateTransaction(currentGoal) {
    const index = GoalsList.findIndex(item => item.id === currentGoal.id)
    if (index !== -1) {
      const newGoalsList = GoalsList;
      newGoalsList[index] = currentGoal;

      await AsyncStorage.setItem('goals', JSON.stringify(newGoalsList));

      loadData()

      ToastAndroid.show('Meta Atualizada', ToastAndroid.SHORT);
    }
  }

  async function deleteTransaction(currentGoal) {
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

            const newGoalList = GoalsList.filter(item => item.id !== currentGoal.id);

            await AsyncStorage.setItem('goals', JSON.stringify(newGoalList));

            loadData()

            ToastAndroid.show('Meta Removida', ToastAndroid.SHORT);
          },
        },
      ])
  }

  const loadData = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('goals');
      if (value !== null) {
        setGoalsList(JSON.parse(value))
      } else {
        await AsyncStorage.setItem('goals', JSON.stringify([]))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData]);

  return (
    <GoalsContext.Provider
      value={{
        GoalsList, setGoalsList,
        addTrasaction,
        deleteTransaction,
        updateTransaction,
        selectedTransaction, setSelectedTransaction
      }}
    >
      {props.children}
    </GoalsContext.Provider>
  );
}
