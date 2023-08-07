import React, { createContext, useCallback, useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { database } from "../databases";
import { usePayments } from "../hooks/usePayments";
import { useSettings } from "../hooks/useSettings";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import * as DocumentPicker from "expo-document-picker";
import { jsonToCSV, readString } from "react-native-csv";

export const RunsContext = createContext({});

export function RunsContextProvider(props) {
  const {
    addTransaction: addPaymentTransaction,
    deleteTransaction: deletePayentTransaction,
  } = usePayments();
  const { willAddFuelToTransactionList, selectedFolderToSave } = useSettings();
  const [FuelList, setFuelList] = useState([]);

  const checkPermissions = async () => {
    try {
      const result = await MediaLibrary.getPermissionsAsync();

      if (!result) {
        const granted = await MediaLibrary.requestPermissionsAsync();

        if (granted === MediaLibrary.PermissionStatus.GRANTED) {
          return true;
        } else {
          Alert.alert("Error", "As permissões não foram concedidas");

          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async function handleCSVtoArrayFormat(data) {
    const [headers, ...rows] = data;
    let newArray = [];

    for (const row of rows) {
      let i = 0;
      let newRowObject = {};
      for (const header of headers) {
        newRowObject[header] = row[i];
        i = i + 1;
      }
      newArray.push(newRowObject);
    }

    if (newArray[newArray.length - 1].description === undefined) {
      newArray.pop();
    }

    return newArray;
  }

  async function handleExportRuns() {
    const currentDate = new Date();
    try {
      const CSV = jsonToCSV(FuelList);

      const directoryUri = selectedFolderToSave;

      const fileName = `corridas-${
        currentDate.getDate() < 10
          ? "0" + currentDate.getDate()
          : currentDate.getDate()
      }-${
        currentDate.getMonth() + 1 < 10
          ? "0" + (currentDate.getMonth() + 1)
          : currentDate.getMonth() + 1
      }-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}.csv`;

      const result = await checkPermissions();

      if (result) {
        const createdFile =
          await FileSystem.StorageAccessFramework.createFileAsync(
            directoryUri,
            fileName,
            "text/*"
          );

        const writedFile =
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            createdFile,
            CSV,
            { encoding: "utf8" }
          );

        ToastAndroid.show(
          "Abastecimentos exportados com sucesso para a pasta selecionada",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Houve um problema ao exportar os abastecimentos!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao exportar os abastecimentos!",
        ToastAndroid.SHORT
      );
    }
  }

  async function handleImportRuns() {
    try {
      const result = await checkPermissions();
      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: "text/*",
        });
        if (result.type === "success") {
          let fileContent = await FileSystem.readAsStringAsync(result.uri, {
            encoding: "utf8",
          });
          const dataFromCSV = readString(fileContent);
          const csvFormated = await handleCSVtoArrayFormat(dataFromCSV.data);
          if (csvFormated) {
            const importedTransactions = csvFormated.map((item) => {
              const row = {
                currentDistance: item.currentDistance,
                unityAmount: Number(item.unityAmount),
                amount: Number(item.amount),
                type: item.type,
                date: Number(item.date),
                location: item.location,
              };

              return row;
            });
            await importTransactions(importedTransactions);
          } else {
            ToastAndroid.show(
              "Houve um problema ao exportar as finanças!",
              ToastAndroid.SHORT
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao importar as finanças!",
        ToastAndroid.SHORT
      );
    }
  }

  async function importTransactions(importedList) {
    for (const importedItem of importedList) {
      try {
        await database.write(async () => {
          await database.get("runs").create((data) => {
            data._raw.currentDistance = Number(importedItem.currentDistance);
            data._raw.unityAmount = Number(importedItem.unityAmount);
            data._raw.amount = Number(importedItem.amount);
            data._raw.type = importedItem.type;
            data._raw.date = Number(importedItem.date);
            data._raw.location = importedItem.location;
          });
        });
      } catch (error) {
        console.log("importTransactions error", error);
      }
    }

    loadTransactions();

    ToastAndroid.show("Importação feita com sucesso", ToastAndroid.SHORT);
  }

  async function deleteTransaction(currentTransaction) {
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
                .get("runs")
                .find(currentTransaction.id);

              await database.write(async () => {
                await itemToDelete.destroyPermanently();
              });
            } catch (error) {
              console.log("deleteTransaction error", error);
            }

            loadTransactions();

            ToastAndroid.show("Abastecimento Removido", ToastAndroid.SHORT);
          },
        },
      ]
    );
  }

  async function addTransaction(newTransaction) {
    try {
      await database.write(async () => {
        await database.get("runs").create((data) => {
          data._raw.currentDistance = Number(newTransaction.currentDistance);
          data._raw.unityAmount = Number(newTransaction.unityAmount);
          data._raw.amount = Number(newTransaction.amount);
          data._raw.type = newTransaction.type;
          data._raw.date = Number(newTransaction.date);
          data._raw.location = newTransaction.location;
        });
      });
    } catch (error) {
      console.log("addTransaction error", error);
    }

    if (willAddFuelToTransactionList) {
      const newPaymentTransaction = {
        description: `Abastecimento - ${newTransaction.location}`,
        amount: newTransaction.amount,
        date: newTransaction.date,
        category: "Transporte",
        paymentDate: newTransaction.date,
        paymentStatus: true,
        isEnabled: true,
        isFavorited: false,
      };

      await addPaymentTransaction(newPaymentTransaction);
    }

    loadTransactions();

    ToastAndroid.show("Abastecimento Adicionado", ToastAndroid.SHORT);
  }

  const loadTransactions = useCallback(async () => {
    try {
      const fuelListCollection = database.get("runs");
      const response = await fuelListCollection.query().fetch();
      const currentList = response.map((item) => item._raw);
      setFuelList(currentList);
    } catch (error) {
      setFuelList([]);
    }

    return;
  }, [setFuelList]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <RunsContext.Provider
      value={{
        FuelList,
        setFuelList,
        addTransaction,
        deleteTransaction,
        handleImportRuns,
        handleExportRuns,
      }}
    >
      {props.children}
    </RunsContext.Provider>
  );
}
