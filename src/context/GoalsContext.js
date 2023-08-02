import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";

export const GoalsContext = createContext({});

export function GoalsContextProvider(props) {
  const [GoalsList, setGoalsList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState();

  async function addTrasaction(newGoal) {
    try {
      await database.write(async () => {
        await database.get("goals").create((data) => {
          data._raw.description = newGoal.description;
          data._raw.amount = newGoal.amount;
          data._raw.currentAmount = newGoal.currentAmount;
          data._raw.date = newGoal.date;
        });
      });
    } catch (error) {
      console.log("addTrasaction error", error);
    }
    loadData();

    ToastAndroid.show("Meta Adicionada", ToastAndroid.SHORT);
  }

  async function updateTransaction(currentGoal) {
    try {
      const itemToUpdate = await database.get("goals").find(currentGoal.id);

      await database.write(async () => {
        await itemToUpdate.update((data) => {
          data._raw.description = currentGoal.description;
          data._raw.amount = currentGoal.amount;
          data._raw.currentAmount = currentGoal.currentAmount;
          data._raw.date = currentGoal.date;
        });
      });
    } catch (error) {
      console.log("updateTransaction error", error);
    }
    loadData();

    ToastAndroid.show("Meta Atualizada", ToastAndroid.SHORT);
  }

  async function deleteTransaction(currentGoal) {
    Alert.alert(
      "Deseja realmente deletar esse registro?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: "Não",
          style: "cancel",
          onPress: () => console.log("Não pressed"),
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const itemToDelete = await database
                .get("goals")
                .find(currentGoal.id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });
            } catch (error) {
              console.log("deleteTransaction error", error);
            }

            loadData();

            ToastAndroid.show("Meta Removida", ToastAndroid.SHORT);
          },
        },
      ]
    );
  }

  const loadData = useCallback(async () => {
    try {
      const goalsCollection = database.get("goals");
      const response = await goalsCollection.query().fetch();
      const currentList = response.map((item) => item._raw);
      setGoalsList(currentList);
    } catch (error) {
      setGoalsList([]);
    }

    return;
  }, [setGoalsList]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <GoalsContext.Provider
      value={{
        GoalsList,
        setGoalsList,
        addTrasaction,
        deleteTransaction,
        updateTransaction,
        selectedTransaction,
        setSelectedTransaction,
      }}
    >
      {props.children}
    </GoalsContext.Provider>
  );
}
