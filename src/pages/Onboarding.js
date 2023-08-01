import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Button, FlatList, Image, Text, useTheme, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid, useWindowDimensions } from "react-native";
import Loading from "../components/Loading";

export default function Onboarding() {
  const theme = useTheme();

  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isOnboardingPassed, setIsOnboardingPassed] = useState("waiting");

  const slides = [
    {
      id: "1",
      image: require("../assets/onboarding/1.png"),
      title: "Organize seus gastos",
      subtitle:
        "Organize as contas a receber, seus ganhos, edite, delete, favorite e filtre para facilitar sua organização.",
      show: false,
    },
    {
      id: "2",
      image: require("../assets/onboarding/2.png"),
      title: "Controle a autonomia do veículo",
      subtitle:
        "Adicione os abastecimentos e tenha o controle da autonomia do veículo e adicione automaticamente os abastecimentos erm finanças",
      show: false,
    },
    {
      id: "3",
      image: require("../assets/onboarding/3.png"),
      title: "Faça sua lista de compras",
      subtitle:
        "Crie sua lista de compras para se programar para as compras do mes. Atualize e remova, se quiser, os itens.",
      show: false,
    },
    {
      id: "4",
      image: require("../assets/onboarding/4.png"),
      title: "Veja os relatórios",
      subtitle:
        "Explore suas finanças com relatórios e crie metas para alcançar seus sonhos mais rápido",
      show: true,
    },
  ];

  async function preleavingOnboarding() {
    Alert.alert(
      "Antes de começar...",
      `Precisamos definir um local onde vamos salvar as tabelas onde você pode acessar e compartilhar com seus amigos e familiares. confirme a solicitação a seguir e crie uma pasta para salvar se for necessário.`,
      [
        {
          text: "Ok",
          onPress: async () => {
            const requestedDirPerm =
              await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            console.log("requestedDirPerm", requestedDirPerm.directoryUri);
            await AsyncStorage.setItem(
              "@selectedFolderToSave",
              requestedDirPerm.directoryUri
            );
            ToastAndroid.show("Pasta selecionada!", ToastAndroid.SHORT);
            await handleLeaveOnboarding();
          },
        },
      ]
    );
  }

  async function handleLeaveOnboarding() {
    try {
      await AsyncStorage.setItem("@onboarding", "true");
      setIsOnboardingPassed("passed");
      navigation.navigate("TabNavigator", { screen: "Finanças" });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isFocused) {
      const executeAsync = async () => {
        try {
          const value = await AsyncStorage.getItem("@onboarding");
          if (value !== null) {
            if (JSON.parse(value)) {
              setIsOnboardingPassed("passed");
              navigation.navigate("TabNavigator", { screen: "Finanças" });
            }
          } else {
            setIsOnboardingPassed("no-passed");
          }
        } catch (e) {
          console.error(e);
        }
      };
      executeAsync();
    }
  }, [isFocused]);

  if (isOnboardingPassed === "waiting") {
    return <Loading />;
  }

  return (
    <FlatList
      pagingEnabled
      horizontal
      data={slides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VStack
          key={item.id}
          bg={theme.colors.purple[900]}
          width={width}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          paddingHorizontal={4}
          space={4}
        >
          <Image
            alt={item.title}
            source={item.image}
            size={width * 0.8}
            borderRadius={2}
          />
          <Text fontSize={18} color={"#F0F2F5"} textAlign={"center"}>
            {item.title}
          </Text>
          <Text fontSize={14} color={"#F0F2F5"} textAlign={"center"}>
            {item.subtitle}
          </Text>

          {item.show && (
            <Button
              onPress={preleavingOnboarding}
              shadow={2}
              colorScheme={"purple"}
              borderRadius={"full"}
              w={"70%"}
              rightIcon={<Feather name="arrow-right" size={24} color="#FFF" />}
              _text={{
                color: "white",
                fontSize: 16,
              }}
            >
              Vamos comecar?!
            </Button>
          )}
        </VStack>
      )}
    />
  );
}
