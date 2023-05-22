import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, ToastAndroid, View, useWindowDimensions } from "react-native";
import { FlatList, RectButton } from "react-native-gesture-handler";
import logo from '../assets/icon.png';

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isOnboardingPassed, setIsOnboardingPassed] = useState("waiting")

  const slides = [
    {
      id: '1',
      image: require('../assets/onboarding/1.png'),
      title: 'Organize seus gastos',
      subtitle: 'Organize as contas a receber, seus ganhos, edite, delete, favorite e filtre para facilitar sua organização.',
      show: false,
    },
    {
      id: '2',
      image: require('../assets/onboarding/2.png'),
      title: 'Controle a autonomia do veículo',
      subtitle: 'Adicione os abastecimentos e tenha o controle da autonomia do veículo e adicione automaticamente os abastecimentos erm finanças',
      show: false,
    },
    {
      id: '3',
      image: require('../assets/onboarding/3.png'),
      title: 'Faça sua lista de compras',
      subtitle: 'Crie sua lista de compras para se programar para as compras do mes. Atualize e remova, se quiser, os itens.',
      show: false,
    },
    {
      id: '4',
      image: require('../assets/onboarding/4.png'),
      title: 'Veja os relatórios',
      subtitle: 'Explore suas finanças com relatórios e crie metas para alcançar seus sonhos mais rápido',
      show: true,
    },
  ]

  async function preleavingOnboarding() {
    Alert.alert(
      "Antes de começar...",
      `Precisamos definir um local onde vamos salvar as tabelas onde você pode acessar e compartilhar com seus amigos e familiares. confirme a solicitação a seguir e crie uma pasta para salvar se for necessário.`,
      [
        {
          text: 'Ok',
          onPress: async () => {
            const requestedDirPerm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
            console.log("requestedDirPerm", requestedDirPerm.directoryUri)
            await AsyncStorage.setItem('@selectedFolderToSave', requestedDirPerm.directoryUri);
            ToastAndroid.show('Pasta selecionada!', ToastAndroid.SHORT);
            await handleLeaveOnboarding();
          },
        },
      ]
    )
  }

  async function handleLeaveOnboarding() {
    try {
      await AsyncStorage.setItem('@onboarding', 'true');
      setIsOnboardingPassed("passed")
      navigation.navigate('Finanças')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (isFocused) {
      const executeAsync = async () => {
        try {
          const value = await AsyncStorage.getItem('@onboarding')
          if (value !== null) {
            if (JSON.parse(value)) {
              setIsOnboardingPassed("passed")
              navigation.navigate('Finanças');
            }
          } else {
            setIsOnboardingPassed("no-passed")
          }
        } catch (e) {
          console.error(e)
        }
      }
      executeAsync();
    }
  }, [isFocused])


  if (isOnboardingPassed === 'waiting') {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#442c61"
      }}>
        <Image
          source={logo}
          style={{
            width: 100,
            height: 100,
            marginBottom: 24,
          }}
        />
        <ActivityIndicator color={"#FFF"} />
      </View>)
  }

  return (
    <FlatList
      pagingEnabled
      horizontal
      data={slides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View key={item.id} style={{
          width: width,
          height: height,
          backgroundColor: '#442c61',
          alignItems: "center",
          justifyContent: 'flex-start',
          paddingHorizontal: 24,
          paddingTop: 24,
        }}>
          <Image
            source={item.image}
            style={{
              width: width * 0.8,
              height: width * 0.8,
              borderRadius: 16,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Poppins_600SemiBold',
              color: '#f0f2f5',
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins_400Regular',
              color: '#f0f2f5',
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {item.subtitle}
          </Text>

          {
            item.show && (
              <RectButton onPress={preleavingOnboarding} style={styles.button}>
                <Text style={styles.buttonText} >
                  Vamos comecar?!
                </Text>
                <Feather name="arrow-right" size={24} style={{ marginLeft: 6 }} color="#FFF" />
              </RectButton>
            )
          }
        </View>
      )}
    />
  )
}


const styles = StyleSheet.create({
  button: {
    borderRadius: 48,
    marginHorizontal: 24,
    marginVertical: 8,
    backgroundColor: '#9c44dc',
    paddingHorizontal: 48,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    marginTop: 6,
    lineHeight: 20,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#f0f2f5',
    textAlign: 'center',
  },
})