import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Box, Button, Divider, HStack, IconButton, Image, Input, Text, VStack, useColorMode, useColorModeValue, useTheme } from 'native-base';
import React from 'react';
import { Alert, BackHandler, Linking, Switch, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import * as DocumentPicker from 'expo-document-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { jsonToCSV, readString } from 'react-native-csv';
import { v4 } from 'uuid';
import userImg from '../assets/icon.png';
import Header from '../components/Header';
import { useMarket } from '../hooks/useMarket';
import { usePayments } from '../hooks/usePayments';
import { useRuns } from '../hooks/useRuns';
import { useSettings } from '../hooks/useSettings';

export default function AboutUs() {
    const theme = useTheme();
    const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
    const headerText = useColorModeValue('white', theme.colors.gray[800]);
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const navigation = useNavigation();

    const {
        colorMode,
        toggleColorMode
    } = useColorMode();


    const {
        transactionsList,
        Tithe,
        importTransactions,
        setTransactionsList,
    } = usePayments();

    const { setMarketList, MarketList, importMarket } = useMarket();

    const { setFuelList, FuelList, importRuns } = useRuns();

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
        handleCleanAsyncStorage,
        simpleFinancesItem,
        handleSetSimpleFinancesItem,
        marketSimplifiedItems,
        handleSetmarketSimplifiedItems,
        isShowLabelOnNavigation,
        handleSetIsShowLabelOnNavigation
    } = useSettings();

    const { handleAddFinances } = useMarket();

    async function handleClearMarket() {
        Alert.alert(
            "Deseja realmente deletar esses registros?",
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
                        await AsyncStorage.setItem('market', JSON.stringify([]));
                        setMarketList([])

                        ToastAndroid.show('Compras removidas com sucesso!', ToastAndroid.SHORT);
                    },
                },
            ])
    }

    async function handleClearFinances() {
        Alert.alert(
            "Deseja realmente deletar esses registros?",
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
                        await AsyncStorage.setItem('transactions', JSON.stringify([]));
                        setTransactionsList([])

                        ToastAndroid.show('Finanças removidas com sucesso!', ToastAndroid.SHORT);
                    },
                },
            ])
    }

    async function handleResetSettings() {
        Alert.alert(
            "Deseja realmente redefinir as configurações?",
            "",
            [
                {
                    text: 'Não',
                    style: 'cancel',
                    onPress: () => console.log('Não pressed'),
                },
                {
                    text: 'Sim',
                    onPress: async () => {

                        const defaultSettings = {
                            isEnableTitheCard: false,
                            isEnableTotalHistoryCard: false,
                            willAddFuelToTransactionList: false,
                            willUsePrefixToRemoveTihteSum: false,
                            prefixTithe: '',
                            simpleFinancesItem: false
                        }

                        await AsyncStorage.setItem('Settings', JSON.stringify(defaultSettings))

                        handleSwitchViewTitheCard(false)
                        handleSwitchViewTotalHistoryCard(false)
                        handleToggleWillAddFuel(false)
                        handleWillRemovePrefixToRemove(false)
                        handleSetPrefixTithe('')
                        handleSetSimpleFinancesItem(false)

                        ToastAndroid.show('Configs. redefinidas com sucesso!', ToastAndroid.SHORT);
                    },
                },
            ])
    }

    async function handleClearRuns() {
        Alert.alert(
            "Deseja realmente deletar esses registros?",
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
                        await AsyncStorage.setItem('runs', JSON.stringify([]));
                        setFuelList([])

                        ToastAndroid.show('Finanças removidas com sucesso!', ToastAndroid.SHORT);
                    },
                },
            ])
    }

    const checkPermissions = async () => {
        try {
            const result = await MediaLibrary.getPermissionsAsync()

            if (!result) {
                console.log("Vamo lá")
                const granted = await MediaLibrary.requestPermissionsAsync();

                console.log("checkPermissions", granted)

                if (granted === MediaLibrary.PermissionStatus.GRANTED) {
                    console.log('Você pode usar a camera');
                    return true;
                } else {
                    Alert.alert('Error', "As permissões não foram concedidas");

                    console.log('Camera permission denied');
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
        try {
            const CSV = jsonToCSV(transactionsList)
            const directoryUri = await AsyncStorage.getItem('@selectedFolderToSave');
            const fileName = `financas-${Date.now()}.csv`;
            const result = await checkPermissions();
            if (result) {
                const createdFile = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, 'text/*')
                const writedFile = await FileSystem.StorageAccessFramework.writeAsStringAsync(createdFile, CSV, { encoding: 'utf8' })
                console.log("writedFile", writedFile)

                ToastAndroid.show('Finanças exportadas com sucesso para a pasta selecionada', ToastAndroid.SHORT);

            } else {
                ToastAndroid.show('Houve um problema ao exportar as finanças!', ToastAndroid.SHORT);
            }

        } catch (error) {
            console.log(error)
            ToastAndroid.show('Houve um problema ao exportar as finanças!', ToastAndroid.SHORT);
        }
    }

    async function handleCSVtoArrayFormat(data) {
        const [headers, ...rows] = data;
        let newArray = []

        for (const row of rows) {
            let i = 0;
            let newRowObject = {}
            for (const header of headers) {
                newRowObject[header] = row[i];
                i = i + 1;
            }
            newArray.push(newRowObject)
        }
        newArray.pop()

        return newArray;
    }

    async function handleImportCSV() {
        try {
            const result = await checkPermissions();
            if (result) {
                const result = await DocumentPicker.getDocumentAsync({
                    copyToCacheDirectory: false,
                    type: 'text/*',
                });

                if (result.type === 'success') {
                    let fileContent = await FileSystem.readAsStringAsync(result.uri, { encoding: 'utf8' });
                    const dataFromCSV = readString(fileContent)
                    const csvFormated = await handleCSVtoArrayFormat(dataFromCSV.data)
                    if (csvFormated) {
                        const importedTransactions = csvFormated.map(item => {

                            const row = {
                                id: v4(),
                                amount: Number(item.amount),
                                date: item.date !== '' ? Number(item.date) : '',
                                paymentDate: item.paymentDate !== '' ? Number(item.date) : '',
                                description: item.description,
                                category: item.category,
                                paymentStatus: item.paymentStatus === "true",
                                isEnabled: item.isEnabled === "true",
                                isFavorited: item.isFavorited === "true",
                            }

                            return row
                        })
                        await importTransactions(importedTransactions);
                    } else {
                        ToastAndroid.show('Houve um problema ao exportar as finanças!', ToastAndroid.SHORT);
                    }
                }
            }

        } catch (error) {
            console.log(error)
            ToastAndroid.show('Houve um problema ao importar as finanças!', ToastAndroid.SHORT);
        }
    }

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate('Finanças');
            return true;
        });

        return () => backHandler.remove();
    })

    return (
        <VStack flex={1} bg={bg}>
            <ScrollView flex={1} w={'100%'} h={'100%'}>
                <Header
                    isLeft
                    title="Configuraçõe"
                    iconComponent={
                        <IconButton
                            size={10}
                            borderRadius='full'
                            icon={<Feather name="arrow-left" size={20} color={headerText} />}
                            onPress={() => navigation.goBack()}
                            _pressed={{
                                bgColor: theme.colors.purple[300]
                            }}
                        />
                    }
                />

                <VStack alignItems={"center"} mt={-16}>
                    <Box
                        borderRadius={'full'}
                        w={32}
                        h={32}
                        borderWidth={6}
                        borderColor={theme.colors.purple[900]}
                        bg={bg}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Image
                            alt="logo"
                            source={userImg}
                            borderRadius={'full'}
                            size={105}
                        />
                    </Box>
                </VStack>

                <HStack
                    px={4}
                    alignItems={"center"}
                >
                    <Switch
                        trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                        thumbColor={colorMode === 'dark' ? theme.colors.purple[600] : theme.colors.gray[600]}
                        ios_backgroundColor={theme.colors.gray[600]}
                        onValueChange={toggleColorMode}
                        value={colorMode === 'dark'}
                    />
                    <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>
                        Habilitar Tema Escuro
                    </Text>
                </HStack>

                <HStack
                    px={4}
                    alignItems={"center"}
                >
                    <Switch
                        trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                        thumbColor={isShowLabelOnNavigation ? theme.colors.purple[600] : theme.colors.gray[600]}
                        ios_backgroundColor={theme.colors.gray[600]}
                        onValueChange={handleSetIsShowLabelOnNavigation}
                        value={isShowLabelOnNavigation}
                    />
                    <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>
                        Somente icones na navegação
                    </Text>
                </HStack>

                <HStack
                    px={4}
                    my={2}
                >
                    <Divider />
                </HStack>

                <VStack space={2} px={4}>
                    <Text color={text} bold fontSize={22}>
                        Finanças
                    </Text>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={simpleFinancesItem ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleSetSimpleFinancesItem}
                            value={simpleFinancesItem}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>
                            Usar formulário simplificado de itens
                        </Text>
                    </HStack>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={isEnableTotalHistoryCard ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleSwitchViewTotalHistoryCard}
                            value={isEnableTotalHistoryCard}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>Habilitar card de Saldo</Text>
                    </HStack>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={isEnableTitheCard ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleSwitchViewTitheCard}
                            value={isEnableTitheCard}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>Habilitar card de Dízimo</Text>
                    </HStack>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={willUsePrefixToRemoveTihteSum ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleWillRemovePrefixToRemove}
                            value={willUsePrefixToRemoveTihteSum}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>Remover itens com o prefixo da soma do Dízimo</Text>
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
                            Se o título da transação tiver este prefixo não será contado na soma do dízimo
                        </Text>
                    </VStack>
                </VStack>

                <VStack px={4} space={2} my={2}>
                    <Button
                        onPress={handleGenerateCSV}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Exportar finanças
                    </Button>
                    <Button
                        onPress={handleImportCSV}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Importar finanças
                    </Button>

                    <Text color={text}>
                        Use um arquivo <Text color={text} bold fontSize={16} >.csv </Text>
                        gerado pelo sistema para importar os dados de um amigo ou familiar.
                    </Text>

                    <Button
                        onPress={handleClearFinances}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="trash" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Importar finanças
                    </Button>
                </VStack>

                <HStack
                    px={4}
                    my={2}
                >
                    <Divider />
                </HStack>

                <VStack space={2} px={4} py={2}>
                    <Text color={text} bold fontSize={22}>
                        Combustível
                    </Text>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={willAddFuelToTransactionList ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleToggleWillAddFuel}
                            value={willAddFuelToTransactionList}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>
                            Habilitar adicionar abastecimento automaticamente em finanças
                        </Text>
                    </HStack>
                    <Button
                        onPress={handleClearRuns}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Apagar Combustível
                    </Button>
                </VStack>

                <HStack
                    px={4}
                    my={2}
                >
                    <Divider />
                </HStack>

                <VStack space={2} px={4} py={2}>
                    <Text color={text} bold fontSize={22}>
                        Mercado
                    </Text>
                    <HStack alignItems={"center"}>
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={marketSimplifiedItems ? theme.colors.purple[600] : theme.colors.gray[600]}
                            ios_backgroundColor={theme.colors.gray[600]}
                            onValueChange={handleSetmarketSimplifiedItems}
                            value={marketSimplifiedItems}
                        />
                        <Text color={text} fontSize={16} maxW={'90%'} numberOfLines={2}>
                            Usar formulário simplificado de itens
                        </Text>
                    </HStack>

                    <Button
                        onPress={handleClearMarket}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="file-text" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Apagar Compras
                    </Button>

                    <Button
                        onPress={handleAddFinances}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="dollar-sign" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Add Total em Finanças
                    </Button>

                    <Text color={text}>
                        Para remover basta clicar no item em Finanças e excluir.
                    </Text>

                </VStack>

                <HStack
                    px={4}
                    my={2}
                >
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
                        borderRadius={'full'}
                        leftIcon={<Feather name="settings" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Redefinir configurações
                    </Button>

                    <Button
                        onPress={handleCleanAsyncStorage}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="trash" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Apagar tabelas
                    </Button>

                    <Text color={text}>
                        Essa opção apagará todos os registros do app.
                    </Text>
                </VStack>

                <HStack
                    px={4}
                    my={2}
                >
                    <Divider />
                </HStack>

                <VStack space={2} px={4} py={2}>

                    <Button
                        onPress={() => { Linking.openURL("https://filipeleonelbatista.vercel.app/") }}
                        shadow={2}
                        colorScheme={"purple"}
                        borderRadius={'full'}
                        leftIcon={<Feather name="globe" size={24} color="#FFF" />}
                        _text={{
                            color: 'white',
                            fontSize: 16
                        }}
                    >
                        Sobre o desenvolvedor
                    </Button>

                    <Text
                        textAlign={"center"}
                        fontSize={12}
                        color={text}
                        my={6}
                    >
                        Versão {Constants.manifest.version}
                    </Text>
                </VStack>
            </ScrollView>
        </VStack>
    );
}