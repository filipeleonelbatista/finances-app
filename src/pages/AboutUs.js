import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, BackHandler, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Linking, StyleSheet, Switch, Text, TextInput, ToastAndroid, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

import * as DocumentPicker from 'expo-document-picker';

import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { v4 } from 'uuid';
import userImg from '../assets/icon.png';
import bgImg from '../assets/images/background.png';
import Menu from '../components/Menu';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRuns } from '../hooks/useRuns';

export default function AboutUs() {
    const navigation = useNavigation();

    const height = useHeaderHeight()

    const {
        transactionsList,
        Tithe,
        importTransactions,
        setTransactionsList,
    } = usePayments();

    const { setFuelList } = useRuns();

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
        handleSetSimpleFinancesItem
    } = useSettings();

    const {
        currentTheme,
        handleToggleTheme
    } = useTheme();

    function formatDate(value) {
        return new Date(value).toLocaleDateString('pt-BR')
    }

    async function exportDataToExcel() {
        // const dataCsv = transactionsList.map(item => [item.id, item.description, item.isEnabled ? 'Despesa' : 'Ganho', formatDate(item.date), formatDate(item.paymentDate), item.paymentStatus ? 'Pago' : 'Não Pago', `${item.isEnabled ? '-' : ''}${item.amount}`])
        const dataCsv = transactionsList.map(item => [item.description, item.isEnabled ? 'Despesa' : 'Ganho', formatDate(item.date), formatDate(item.paymentDate), item.paymentStatus ? 'Pago' : 'Não Pago', item.amount])

        let TotalList = 0.0;

        for (const item of transactionsList) {
            if (item.isEnabled) {
                TotalList = TotalList - item.amount
            } else {
                TotalList = TotalList + item.amount
            }
        }


        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            // ['Minhas finanças'],
            // ['Identificador', 'Descrição', 'Tipo', 'Data Venc', 'Data Pgto', 'Status Pgto', 'Valor'],
            ['Descrição', 'Tipo', 'Data Venc', 'Data Pgto', 'Status Pgto', 'Valor'],
            ...dataCsv,
            // ['', '', '', 'Total:', `${TotalList}`],
            // ['', '', '', 'Dizimo:', `${Tithe}`],
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "Financas");
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })

        return wbout;
    }

    const [documentObject, setDocumentObject] = useState();

    const fileReaded = useMemo(async () => {
        const executeTheMission = async () => {
            let fileContent = await FileSystem.readAsStringAsync(documentObject.uri, { encoding: 'utf8' });
            const newFinancesArray = []
            for (const item of fileContent.split("\r\n")) {
                const currentItemArray = item.split(";")
                if (currentItemArray.length === 6) {
                    const currentItemDate = currentItemArray[2] !== '' || currentItemArray[3] !== undefined ? currentItemArray[2].split("/") : ''
                    const currentItemPaymentDate = currentItemArray[3] !== '' || currentItemArray[4] !== undefined ? currentItemArray[3].split("/") : ''
                    const itemObject = {
                        id: v4(),
                        description: currentItemArray[0],
                        isEnabled: currentItemArray[1] === 'Despesa',
                        date: currentItemArray[2] !== '' ? new Date(`${currentItemDate[2]}-${currentItemDate[1]}-${currentItemDate[0]}`).getTime() + 43200000 : '',
                        paymentDate: currentItemArray[3] !== '' ? new Date(`${currentItemPaymentDate[2]}-${currentItemPaymentDate[1]}-${currentItemPaymentDate[0]}`).getTime() + 43200000 : '',
                        paymentStatus: currentItemArray[4] === 'Pago',
                        amount: parseFloat(currentItemArray[5].replace("-", "")),
                    }
                    newFinancesArray.push(itemObject)
                }
            }
            await importTransactions(newFinancesArray);
        }

        if (documentObject) {
            if (documentObject.type === 'success') {
                try {

                    let perm = await MediaLibrary.getPermissionsAsync();

                    if (perm.status != 'granted') {
                        let currentPerm = await MediaLibrary.requestPermissionsAsync();
                        if ('granted' === currentPerm.status) {
                            executeTheMission()
                        } else {
                            ToastAndroid.show('Permissão Negada', ToastAndroid.SHORT);
                        }
                    } else {
                        executeTheMission()
                    }

                } catch (error) {

                    ToastAndroid.show('Importação não foi realizada', ToastAndroid.SHORT);
                    console.log(error)
                }
            }
        } else {
            return null
        }

    }, [documentObject])

    async function handleImportFile() {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: 'text/comma-separated-values',
                copyToCacheDirectory: false,
                multiple: false,
            });
            setDocumentObject(result)
        } catch (error) {
            console.log(error)
        }

    }

    async function handleOpenCSV() {
        try {

            let perm = await MediaLibrary.getPermissionsAsync();
            if (perm.status != 'granted') {
                let currentPerm = await MediaLibrary.requestPermissionsAsync();
                if ('granted' === currentPerm.status) {
                    const result = await exportDataToExcel()

                    let fileUri = FileSystem.documentDirectory + "financas" + Date.now() + ".xlsx";

                    try {
                        FileSystem.writeAsStringAsync(fileUri, result, { encoding: FileSystem.EncodingType.Base64 })
                            .then(() => {
                                ToastAndroid.show('Exportado com sucesso', ToastAndroid.SHORT);
                                Sharing.shareAsync(fileUri)
                            })


                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    ToastAndroid.show('Permissão Negada', ToastAndroid.SHORT);
                }
            }
            else {
                const result = await exportDataToExcel()
                let fileUri = FileSystem.documentDirectory + "financas" + Date.now() + ".xlsx";

                try {
                    FileSystem.writeAsStringAsync(fileUri, result, { encoding: FileSystem.EncodingType.Base64 })
                        .then(() => {
                            ToastAndroid.show('Exportado com sucesso', ToastAndroid.SHORT);
                            Sharing.shareAsync(fileUri)
                        })


                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            ToastAndroid.show('Houve um problema', ToastAndroid.SHORT);
            console.log("Error while check permissions")
            console.log(error)
            return
        }
    }


    async function handleSaveFile() {
        try {
            const appDirectoryUrl = FileSystem.documentDirectory + 'documentos-app-financas';

            const { exists } = await FileSystem.getInfoAsync(appDirectoryUrl);
            console.log("Existe?", exists, appDirectoryUrl);

            if (!exists) {
                const result = await FileSystem.makeDirectoryAsync(appDirectoryUrl);
                console.log("Criar pasta", result, appDirectoryUrl);
            }

            const csvStream = await exportDataToExcel();

            const fileName = `/export-financas-${Date.now()}.xlsx`;

            await FileSystem.writeAsStringAsync(appDirectoryUrl + fileName, csvStream, { encoding: FileSystem.EncodingType.Base64 });
            const fileCreated = await FileSystem.getInfoAsync(appDirectoryUrl + fileName);

            console.log("Criar arquivo", fileCreated);

            const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: false });

            console.log("Pasta selecionada para salvar", result)

            if (result.type === 'success') {
                const fileUri = result.uri;

                await FileSystem.copyAsync({
                    from: appDirectoryUrl + fileName,
                    to: fileUri
                });

                ToastAndroid.show('Arquivo criado com sucesso!', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Arquivo não foi criado', ToastAndroid.SHORT);
            }

        } catch (error) {
            ToastAndroid.show('Erro na geração do arquivo', ToastAndroid.SHORT);
            console.error(error);
        }
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

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate('Finanças');
            return true;
        });

        return () => backHandler.remove();
    })

    return (
        <Menu>
            <KeyboardAvoidingView
                behavior={'padding'}
                keyboardVerticalOffset={height + 48}
                enabled
            >
                <ScrollView
                    style={styles.ScrollViewContainer}
                >
                    <ImageBackground source={bgImg} style={styles.header}>
                        <View style={styles.headerItens}>
                            <Text style={{
                                fontFamily: 'Poppins_600SemiBold',
                                fontSize: 28,
                                color: currentTheme === 'dark' ? '#1c1e21' : '#FFF'
                            }}>
                                Configuraçõe<Text style={{ color: '#543b6c' }}>$</Text>
                            </Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.imageContainer}>
                        <View style={styles.imageBorder} >
                            <View style={{ ...styles.imageBackgroundWhite, backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF' }}>
                                <Image source={userImg} style={styles.image} />
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 8 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={currentTheme === 'dark' ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleToggleTheme}
                            value={currentTheme === 'dark'}
                        />
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Habilitar Tema Escuro
                        </Text>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
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
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
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
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Habilitar card de Saldo</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={isEnableTitheCard ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleSwitchViewTitheCard}
                            value={isEnableTitheCard}
                        />
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Habilitar card de Dízimo</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={willUsePrefixToRemoveTihteSum ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={handleWillRemovePrefixToRemove}
                            value={willUsePrefixToRemoveTihteSum}
                        />
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Remover itens com o prefixo da soma do Dízimo</Text>
                    </View>
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Prefixo</Text>
                        <TextInput

                            placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                            style={{
                                ...styles.input,
                                backgroundColor: !willUsePrefixToRemoveTihteSum ? currentTheme === 'dark' ? '#333' : '#DDD' : currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                                color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                                marginBottom: 4
                            }}
                            placeholder="Prefixo"
                            onChangeText={handleSetPrefixTithe}
                            value={prefixTithe}
                            editable={willUsePrefixToRemoveTihteSum}
                        />
                        <Text style={{ ...styles.helperText, color: currentTheme === 'dark' ? "#CCC" : "#666" }}>Se o título da transação tiver este prefixo não será contado na soma do dízimo</Text>
                    </View>

                    <RectButton onPress={handleOpenCSV} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Exportar finanças
                        </Text>
                    </RectButton>
                    <RectButton onPress={handleImportFile} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Importar finanças
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: currentTheme === 'dark' ? "#CCC" : "#666", }}>
                        Use um arquivo <Text style={{ color: currentTheme === 'dark' ? "#FFF" : "#333", fontWeight: 'bold', fontSize: 16 }} >.csv</Text>
                        para importar dados com as colunas Descrição, Despesa/Ganho, Data de vencimento, Data de pagamento, Pago/Não Pago, Valor.
                    </Text>
                    <RectButton onPress={handleClearFinances} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar Finanças
                        </Text>
                    </RectButton>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
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
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Habilitar adicionar abastecimento automaticamente em finanças
                        </Text>
                    </View>
                    <RectButton onPress={handleClearRuns} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar Combustível
                        </Text>
                    </RectButton>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 4 }}>
                        <Text style={{ ...styles.labelSwitch, marginBottom: 8, fontSize: 22, fontWeight: 'bold', color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                            Geral
                        </Text>
                    </View>
                    {/* 
                    <RectButton onPress={handleSaveFile} style={styles.button}>
                        <Feather name="file-text" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Teste
                        </Text>
                    </RectButton> 
                    */}


                    <RectButton onPress={handleCleanAsyncStorage} style={styles.button}>
                        <Feather name="trash" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Apagar tabelas
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, marginBottom: 8, marginHorizontal: 48, color: currentTheme === 'dark' ? "#CCC" : "#666", }}>
                        Essa opção apagará todos os registros do app.
                    </Text>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 8, height: 1, width: '90%', backgroundColor: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }} />
                    </View>

                    <RectButton onPress={() => { Linking.openURL("https://filipeleonelbatista.vercel.app/") }} style={styles.button}>
                        <Feather name="globe" size={24} style={{ marginRight: 6 }} color="#FFF" />
                        <Text style={styles.buttonText} >
                            Sobre o desenvolvedor
                        </Text>
                    </RectButton>

                    <Text style={{ ...styles.helperText, textAlign: 'center', marginBottom: 8, marginHorizontal: 48, color: currentTheme === 'dark' ? "#CCC" : "#666", }}>
                        Versão 1.1.5
                    </Text>
                    <View style={{ height: 32 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Menu>
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