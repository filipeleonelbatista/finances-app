import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
  useTheme,
  VStack
} from "native-base";
import React from "react";
import {
  Alert,
  BackHandler,
  Linking,
  Switch,
  ToastAndroid
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import * as DocumentPicker from "expo-document-picker";

import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { jsonToCSV, readString } from "react-native-csv";
import userImg from "../assets/icon.png";
import Header from "../components/Header";
import { database } from "../databases";
import { useLists } from "../hooks/useLists";
import { useMarket } from "../hooks/useMarket";
import { useOpenAi } from "../hooks/useOpenAi";
import { usePayments } from "../hooks/usePayments";
import { useRuns } from "../hooks/useRuns";
import { useSettings } from "../hooks/useSettings";

export default function AboutUs() {
  const theme = useTheme();
  const bg = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[900]
  );
  const headerText = useColorModeValue("white", theme.colors.gray[800]);
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const navigation = useNavigation();

  const { colorMode } = useColorMode();

  const { apiKey, handleSaveApiKey } = useOpenAi();

  const isFocused = useIsFocused();
  const [inputOpenAiText, setInputOpenAiText] = useState("");

  const { transactionsList, importTransactions, setTransactionsList } =
    usePayments();

  const { setFuelList, handleImportRuns, handleExportRuns } = useRuns();

  const { handleImportStock, handleExportStock, loadTransactions } =
    useMarket();

  const { loadTransactions: loadTransactionsLists, handleImportList } =
    useLists();

  const {
    isEnableTitheCard,
    handleSwitchViewTitheCard,
    willAddFuelToTransactionList,
    handleToggleWillAddFuel,
    willUsePrefixToRemoveTihteSum,
    handleWillRemovePrefixToRemove,
    prefixTithe,
    handleSetPrefixTithe,
    isEnableTotalHistoryCard,
    handleSwitchViewTotalHistoryCard,
    handleCleanStorage,
    simpleFinancesItem,
    handleSetSimpleFinancesItem,
    marketSimplifiedItems,
    handleSetmarketSimplifiedItems,
    isShowLabelOnNavigation,
    handleSetIsShowLabelOnNavigation,
    handleToggleTheme,
    handleSetIsAiEnabled,
    isAiEnabled,
    selectedFolderToSave,
    handleResetConfigs,
  } = useSettings();

  async function handleClearMarket() {
    Alert.alert(
      "Deseja realmente deletar esses registros?",
      "Esta ação é irreversível! Deseja continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Não pressed"),
        },
        {
          text: "Apagar Listas",
          onPress: async () => {
            await database.write(async () => {
              const listsCollection = database.collections.get("lists");
              const allLists = await listsCollection.query().fetch();
              for (const item of allLists) {
                await item.destroyPermanently();
              }
              const itemsCollection = database.collections.get("items");
              const allItems = await itemsCollection.query().fetch();
              for (const item of allItems) {
                await item.destroyPermanently();
              }
            });

            await loadTransactionsLists();

            ToastAndroid.show(
              "Listas de compras removidas com sucesso!",
              ToastAndroid.SHORT
            );
          },
        },
        {
          text: "Apagar estoque",
          onPress: async () => {
            await database.write(async () => {
              const stockCollection = database.collections.get("stock");
              const allStock = await stockCollection.query().fetch();
              for (const item of allStock) {
                await item.destroyPermanently();
              }
            });

            await loadTransactions();

            ToastAndroid.show(
              "Estoque removido com sucesso!",
              ToastAndroid.SHORT
            );
          },
        },
        {
          text: "Apagar tudo",
          onPress: async () => {
            await database.write(async () => {
              const stockCollection = database.collections.get("stock");
              const allStock = await stockCollection.query().fetch();
              for (const item of allStock) {
                await item.destroyPermanently();
              }
              const listsCollection = database.collections.get("lists");
              const allLists = await listsCollection.query().fetch();
              for (const item of allLists) {
                await item.destroyPermanently();
              }
              const itemsCollection = database.collections.get("items");
              const allItems = await itemsCollection.query().fetch();
              for (const item of allItems) {
                await item.destroyPermanently();
              }
            });

            await loadTransactions();
            await loadTransactionsLists();

            ToastAndroid.show(
              "Compras removidas com sucesso!",
              ToastAndroid.SHORT
            );
          },
        },
      ]
    );
  }

  async function handleClearFinances() {
    Alert.alert(
      "Deseja realmente deletar esses registros?",
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
            await database.write(async () => {
              const financesCollection = database.collections.get("finances");
              const allFinances = await financesCollection.query().fetch();
              for (const item of allFinances) {
                await item.destroyPermanently();
              }
            });
            setTransactionsList([]);

            ToastAndroid.show(
              "Finanças removidas com sucesso!",
              ToastAndroid.SHORT
            );
          },
        },
      ]
    );
  }

  async function handleResetSettings() {
    Alert.alert("Deseja realmente redefinir as configurações?", "", [
      {
        text: "Não",
        style: "cancel",
        onPress: () => console.log("Não pressed"),
      },
      {
        text: "Sim",
        onPress: async () => {
          await handleResetConfigs();

          ToastAndroid.show(
            "Configs. redefinidas com sucesso!",
            ToastAndroid.SHORT
          );
        },
      },
    ]);
  }

  async function handleClearRuns() {
    Alert.alert(
      "Deseja realmente deletar esses registros?",
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
            await database.write(async () => {
              const runsCollection = database.collections.get("runs");
              const allRuns = await runsCollection.query().fetch();
              for (const item of allRuns) {
                await item.destroyPermanently();
              }
            });

            setFuelList([]);

            ToastAndroid.show(
              "Finanças removidas com sucesso!",
              ToastAndroid.SHORT
            );
          },
        },
      ]
    );
  }

  const checkPermissions = async () => {
    try {
      const result = await MediaLibrary.getPermissionsAsync();

      if (!result) {
        console.log("Vamo lá");
        const granted = await MediaLibrary.requestPermissionsAsync();

        console.log("checkPermissions", granted);

        if (granted === MediaLibrary.PermissionStatus.GRANTED) {
          console.log("Você pode usar a camera");
          return true;
        } else {
          Alert.alert("Error", "As permissões não foram concedidas");

          console.log("Camera permission denied");
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

  async function handleGenerateCSV() {
    const currentDate = new Date();
    try {
      const CSV = jsonToCSV(transactionsList);
      const directoryUri = selectedFolderToSave;
      const fileName = `financas-${
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
          "Finanças exportadas com sucesso para a pasta selecionada",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Houve um problema ao exportar as finanças!",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Houve um problema ao exportar as finanças!",
        ToastAndroid.SHORT
      );
    }
  }

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

  async function handleImportCSV() {
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
                amount: Number(item.amount),
                date: item.date !== "" ? Number(item.date) : "",
                paymentDate: item.paymentDate !== "" ? Number(item.date) : "",
                description: item.description,
                category: item.category,
                paymentStatus: item.paymentStatus,
                isEnabled: item.isEnabled,
                isFavorited: item.isFavorited,
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

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    if (isFocused) {
      setInputOpenAiText(apiKey);
    }
  }, [apiKey]);

  return (
    <VStack flex={1} bg={bg}>
      <ScrollView flex={1} w={"100%"} h={"100%"}>
        <Header
          title="Configuraçõe"
          isLeftIconComponent={
            <IconButton
              size={10}
              borderRadius="full"
              icon={<Feather name="arrow-left" size={20} color={headerText} />}
              onPress={() => navigation.goBack()}
              _pressed={{
                bgColor: theme.colors.purple[900],
              }}
            />
          }
        />

        <VStack alignItems={"center"} mt={-16}>
          <Box
            borderRadius={"full"}
            w={32}
            h={32}
            borderWidth={6}
            borderColor={theme.colors.purple[900]}
            bg={bg}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image
              alt="logo"
              source={userImg}
              borderRadius={"full"}
              size={105}
            />
          </Box>
        </VStack>
        <VStack space={2} px={4}>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                colorMode === "dark"
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleToggleTheme}
              value={colorMode === "dark"}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Habilitar Tema Escuro
            </Text>
          </HStack>

          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                isShowLabelOnNavigation
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSetIsShowLabelOnNavigation}
              value={isShowLabelOnNavigation}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Titulos nos icones da navegação
            </Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                isAiEnabled ? theme.colors.purple[600] : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSetIsAiEnabled}
              value={isAiEnabled}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Habilitar Inteligência artificial (Beta)
            </Text>
          </HStack>

          {isAiEnabled && (
            <VStack space={1}>
              <Text color={text} fontSize={16}>
                Chave de API
              </Text>
              <Input
                placeholder="Chave de API"
                onChangeText={(text) => {
                  setInputOpenAiText(text);
                }}
                value={inputOpenAiText}
                editable={isAiEnabled}
                rightElement={
                  <Button
                    size="xs"
                    rounded="none"
                    w="1/6"
                    p={0}
                    h="full"
                    bgColor={theme.colors.purple[600]}
                    onPress={() => {
                      handleSaveApiKey(inputOpenAiText);
                    }}
                  >
                    <Feather name="save" size={24} color="#FFF" />
                  </Button>
                }
              />
              <Text color="gray.400">
                Coloque aqui sua Chave de Api da OpenAI
              </Text>
              <Link
                href={"https://platform.openai.com/account/api-keys"}
                _text={{ color: "purple.500" }}
              >
                Toque aqui para obter uma Chave de API OpenAi
              </Link>
            </VStack>
          )}

          <HStack my={2}>
            <Divider />
          </HStack>
        </VStack>

        <VStack space={2} px={4}>
          <Text color={text} bold fontSize={22}>
            Finanças
          </Text>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                simpleFinancesItem
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSetSimpleFinancesItem}
              value={simpleFinancesItem}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Usar formulário simplificado de itens
            </Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                isEnableTotalHistoryCard
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSwitchViewTotalHistoryCard}
              value={isEnableTotalHistoryCard}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Habilitar card de Saldo
            </Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                isEnableTitheCard
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSwitchViewTitheCard}
              value={isEnableTitheCard}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Habilitar card de Dízimo
            </Text>
          </HStack>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                willUsePrefixToRemoveTihteSum
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleWillRemovePrefixToRemove}
              value={willUsePrefixToRemoveTihteSum}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Remover itens com o prefixo da soma do Dízimo
            </Text>
          </HStack>

          <VStack space={2}>
            <Text color={text} fontSize={16}>
              Prefixo
            </Text>
            <Input
              keyboardType="decimal-pad"
              placeholder="Prefixo"
              onChangeText={handleSetPrefixTithe}
              value={prefixTithe}
              editable={willUsePrefixToRemoveTihteSum}
            />
            <Text color="gray.400">
              Se o título da transação tiver este prefixo não será contado na
              soma do dízimo
            </Text>
          </VStack>
        </VStack>

        <VStack px={4} space={2} my={2}>
          <Button
            onPress={handleGenerateCSV}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Exportar finanças
          </Button>
          <Button
            onPress={handleImportCSV}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Importar finanças
          </Button>

          <Text color={text} px={2} textAlign="center">
            Use um arquivo{" "}
            <Text color={text} bold fontSize={16}>
              .csv{" "}
            </Text>
            gerado pelo sistema para importar os dados de um amigo ou familiar.
          </Text>

          <Button
            onPress={handleClearFinances}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="trash" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Apagar finanças
          </Button>
        </VStack>

        <HStack px={4} my={2}>
          <Divider />
        </HStack>

        <VStack space={2} px={4} py={2}>
          <Text color={text} bold fontSize={22}>
            Corridas
          </Text>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                willAddFuelToTransactionList
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleToggleWillAddFuel}
              value={willAddFuelToTransactionList}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Habilitar adicionar abastecimento automaticamente em finanças
            </Text>
          </HStack>
          <Button
            onPress={handleExportRuns}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Exportar Abastecimentos
          </Button>
          <Button
            onPress={handleImportRuns}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Importar Abastecimentos
          </Button>

          <Text color={text} px={2} textAlign="center">
            Use um arquivo{" "}
            <Text color={text} bold fontSize={16}>
              .csv{" "}
            </Text>
            gerado pelo sistema para importar os dados de um amigo ou familiar.
          </Text>

          <Button
            onPress={handleClearRuns}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Apagar Abastecimentos
          </Button>
        </VStack>

        <HStack px={4} my={2}>
          <Divider />
        </HStack>

        <VStack space={2} px={4} py={2}>
          <Text color={text} bold fontSize={22}>
            Compras
          </Text>
          <HStack alignItems={"center"}>
            <Switch
              trackColor={{
                false: theme.colors.gray[400],
                true: theme.colors.gray[400],
              }}
              thumbColor={
                marketSimplifiedItems
                  ? theme.colors.purple[600]
                  : theme.colors.gray[600]
              }
              ios_backgroundColor={theme.colors.gray[600]}
              onValueChange={handleSetmarketSimplifiedItems}
              value={marketSimplifiedItems}
            />
            <Text color={text} fontSize={16} maxW={"90%"} numberOfLines={2}>
              Usar formulário simplificado de itens
            </Text>
          </HStack>
          <Button
            onPress={handleExportStock}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Exportar Estoque
          </Button>
          <Button
            onPress={handleImportStock}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Importar Estoque
          </Button>

          <Text color={text} px={2} textAlign="center">
            Use um arquivo{" "}
            <Text color={text} bold fontSize={16}>
              .csv{" "}
            </Text>
            gerado pelo sistema para importar os dados de um amigo ou familiar.
          </Text>

          <Button
            onPress={handleImportList}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Importar Lista de compras
          </Button>

          <Text color={text} px={2} textAlign="center">
            Para exportar pressione e segure o card da lista que quer exportar.
          </Text>

          <Button
            onPress={handleClearMarket}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Apagar Compras
          </Button>
        </VStack>

        <HStack px={4} my={2}>
          <Divider />
        </HStack>

        <VStack space={2} px={4} py={2}>
          <Text color={text} bold fontSize={22}>
            Geral
          </Text>

          <Button
            onPress={handleResetSettings}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="settings" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Redefinir configurações
          </Button>

          <Button
            onPress={handleCleanStorage}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="trash" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Apagar tabelas
          </Button>

          <Text color={text} px={2} textAlign="center">
            Essa opção apagará todos os registros do app.
          </Text>
        </VStack>

        <HStack px={4} my={2}>
          <Divider />
        </HStack>

        <VStack space={2} px={4} py={2}>
          <Button
            onPress={() => {
              Linking.openURL("https://filipeleonelbatista.vercel.app/");
            }}
            shadow={2}
            colorScheme={"purple"}
            borderRadius={"full"}
            leftIcon={<Feather name="globe" size={24} color="#FFF" />}
            _text={{
              color: "white",
              fontSize: 16,
            }}
            _pressed={{
              bgColor: theme.colors.purple[900],
            }}
          >
            Sobre o desenvolvedor
          </Button>

          <Text textAlign={"center"} fontSize={12} color={text} my={6}>
            Versão {Constants.manifest.version}
          </Text>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
