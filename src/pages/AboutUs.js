import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { IconButton, VStack, useColorMode, useColorModeValue, useTheme } from 'native-base';
import React from 'react';
import { Alert, BackHandler, Dimensions, Image, KeyboardAvoidingView, Linking, StyleSheet, Switch, Text, TextInput, ToastAndroid, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import * as DocumentPicker from 'expo-document-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
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

    const height = useHeaderHeight()

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
        handleSetmarketSimplifiedItems
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
        <VStack>
            <KeyboardAvoidingView
                behavior={'padding'}
                keyboardVerticalOffset={height + 48}
                enabled
            >
                <ScrollView
                    style={styles.ScrollViewContainer}
                >
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
                                    color: theme.colors.purple[300]
                                }}
                            />
                        }
                    />
                    <View style={styles.imageContainer}>
                        <View style={styles.imageBorder} >
                            <View style={{ ...styles.imageBackgroundWhite, backgroundColor: colorMode === 'dark' ? '#1c1e21' : '#FFF' }}>
                                <Image source={userImg} style={styles.image} />
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 8 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={colorMode === 'dark' ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleColorMode}
                            value={colorMode === 'dark'}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Habilitar Tema Escuro
                        </Text>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: colorMode === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Finanças
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={simpleFinancesItem ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleSetSimpleFinancesItem}
                            value={simpleFinancesItem}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Usar formulário simplificado de itens
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={isEnableTotalHistoryCard ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleSwitchViewTotalHistoryCard}
                            value={isEnableTotalHistoryCard}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>Habilitar card de Saldo</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={isEnableTitheCard ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleSwitchViewTitheCard}
                            value={isEnableTitheCard}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>Habilitar card de Dízimo</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={willUsePrefixToRemoveTihteSum ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleWillRemovePrefixToRemove}
                            value={willUsePrefixToRemoveTihteSum}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>Remover itens com o prefixo da soma do Dízimo</Text>
                    </View>
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={{ ...styles.label, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>Prefixo</Text>
                        <TextInput

                            placeholderTextColor={colorMode === 'dark' ? '#FFF' : '#1c1e21'}
                            style={{
                                ...styles.input,
                                backgroundColor: !willUsePrefixToRemoveTihteSum ? colorMode === 'dark' ? '#333' : '#DDD' : colorMode === 'dark' ? '#1c1e21' : '#FFF',
                                color: colorMode === 'dark' ? '#FFF' : '#1c1e21',
                                marginBottom: 4
                            }}
                            placeholder="Prefixo"
                            onChangeText={handleSetPrefixTithe}
                            value={prefixTithe}
                            editable={willUsePrefixToRemoveTihteSum}
                        />
                        <Text style={{ ...styles.helperText, color: colorMode === 'dark' ? "#CCC" : "#666" }}>Se o título da transação tiver este prefixo não será contado na soma do dízimo</Text>
                    </View>

                    <RectButton onPress={handleGenerateCSV} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Exportar finanças
                        </Text>
                    </RectButton>
                    <RectButton onPress={handleImportCSV} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Importar finanças
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Use um arquivo <Text style={{ color: colorMode === 'dark' ? "#FFF" : "#333", fontWeight: 'bold', fontSize: 16 }} >.csv </Text>
                        gerado pelo sistema para importar os dados de um amigo ou familiar.
                    </Text>

                    <RectButton onPress={handleClearFinances} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar Finanças
                        </Text>
                    </RectButton>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: colorMode === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Combustível
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={willAddFuelToTransactionList ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleToggleWillAddFuel}
                            value={willAddFuelToTransactionList}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Habilitar adicionar abastecimento automaticamente em finanças
                        </Text>
                    </View>
                    <RectButton onPress={handleClearRuns} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar Combustível
                        </Text>
                    </RectButton>

                    {/* <RectButton onPress={handleExportRuns} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Exportar Abastecimentos
                        </Text>
                    </RectButton>
                    <RectButton onPress={handleImportRuns} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Importar Abastecimentos
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Use um arquivo <Text style={{ color: colorMode === 'dark' ? "#FFF" : "#333", fontWeight: 'bold', fontSize: 16 }} >.csv </Text>
                        para importar dados com as colunas Local do abastecimento, Data do abasatecimento, Tipo, Valor Litro, Valor pago, Km Atual.
                    </Text> */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: colorMode === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Mercado
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={marketSimplifiedItems ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleSetmarketSimplifiedItems}
                            value={marketSimplifiedItems}
                        />
                        <Text style={{ ...styles.labelSwitch, color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Usar formulário simplificado de itens
                        </Text>
                    </View>
                    <RectButton onPress={handleClearMarket} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar Compras
                        </Text>
                    </RectButton>
                    <RectButton onPress={handleAddFinances} style={styles.button}>
                        <Feather name="dollar-sign" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Add Total em Finanças
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Para remover basta clicar no item em Finanças e excluir.
                    </Text>

                    {/* <RectButton onPress={handleExportMarket} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Exportar compras
                        </Text>
                    </RectButton>
                    <RectButton onPress={handleImportMarket} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Importar compras
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Use um arquivo <Text style={{ color: colorMode === 'dark' ? "#FFF" : "#333", fontWeight: 'bold', fontSize: 16 }} >.csv </Text>
                        para importar dados com as colunas Produto, Categoria, Quantidade, Valor.
                    </Text> */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: colorMode === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: colorMode === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Geral
                        </Text>
                    </View>

                    <RectButton onPress={handleResetSettings} style={styles.button}>
                        <Feather name="settings" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Redefinir configurações
                        </Text>
                    </RectButton>

                    <RectButton onPress={handleCleanAsyncStorage} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar tabelas
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Essa opção apagará todos os registros do app.
                    </Text>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: colorMode === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>

                    <RectButton onPress={() => { Linking.openURL("https://filipeleonelbatista.vercel.app/") }} style={styles.button}>
                        <Feather name="globe" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Sobre o desenvolvedor
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, textAlign: 'center', marginBottom: 8, marginHorizontal: 48, color: colorMode === 'dark' ? "#CCC" : "#666", }}>
                        Versão {Constants.manifest.version}
                    </Text>
                    <View style={{ height: 32 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </VStack>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -70,
    },
    dev: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#363f5f'
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#363f5f'
    },
    contentImg: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 12
    },
    content: {
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    imageBorder: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: '#543b6c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    imageBackgroundWhite: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    techs: {
        width: 32,
        height: 32,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#f0f2f5',
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5',
        marginVertical: 24,
    },
    ScrollViewContainer: {
        width: '100%',
        height: 'auto',
        paddingBottom: 16,
        marginBottom: 48,
    },
    header: {
        height: 130,
        width: '100%',
        backgroundColor: '#9c44dc',
    },
    headerItens: {
        marginHorizontal: 24,
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerEmpty: {
        width: 48,
        height: 48,
        borderRadius: 32,
    },
    headerButton: {
        width: 48,
        height: 48,
        borderRadius: 32,
        backgroundColor: '#9c44dc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerButtonText: {
        fontSize: 24,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5',
    },
    cardWite: {
        flexDirection: 'column',
        borderRadius: 4,
        marginHorizontal: 24,
        marginVertical: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 48,
        paddingVertical: 24,
    },
    cardGreen: {
        borderRadius: 4,
        marginHorizontal: 24,
        marginVertical: 6,
        backgroundColor: '#9c44dc',
        paddingHorizontal: 48,
        paddingVertical: 24,
    },
    cardTextGreen: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5',
        marginBottom: 24,
        marginBottom: 12,
    },
    cardValueGreen: {
        fontSize: 32,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5'
    },
    cardText: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 24,
        marginBottom: 12,
    },
    cardValue: {
        fontSize: 32,
        fontFamily: 'Poppins_400Regular',
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
        backgroundColor: '#2D4A22',
    },
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
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5',
        textAlign: 'center',
    },
    labelSwitch: {
        width: '80%',
        fontSize: 16,
        color: '#363f5f',
        fontFamily: 'Poppins_400Regular',
    },
    label: {
        marginTop: 18,
        fontSize: 18,
        color: '#363f5f',
        fontFamily: 'Poppins_400Regular',
    },
    input: {
        marginTop: 6,
        paddingHorizontal: 12,
        backgroundColor: '#FFF',
        borderColor: "#CCC",
        borderRadius: 4,
        width: '100%',
        height: 48,
        borderWidth: 1
    },
    helperText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
        textAlign: 'left',
    },
})