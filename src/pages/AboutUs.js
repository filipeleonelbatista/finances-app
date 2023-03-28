import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Clipboard, Dimensions, Image, ImageBackground, Linking, PermissionsAndroid, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import XLSX from 'xlsx';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import userImg from '../assets/icon.png';
import bgImg from '../assets/images/background.png';
import Menu from '../components/Menu';
import { usePayments } from '../hooks/usePayments';

export default function AboutUs() {
    const {
        transactionsList,
        Incomings,
        Expenses,
        Total,
        Saldo,
        Tithe
    } = usePayments();

    const [csvContent, setCsvContent] = useState(null);

    const navigation = useNavigation()

    function handleCopyToClipboardPixKey() {
        Clipboard.setString("f1bfe5be-67eb-42ad-8928-f71e02e1c99b");
        Alert.alert(
            "Chave pix copiada",
            "Agora só fazer um pix de qualquer valor usando a chave copiada neste botão", !
        [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
            { cancelable: false }
        );
    }

    function formatDate(value) {
        return new Date(value).toLocaleDateString('pt-BR')
    }

    async function exportDataToExcel() {
        const dataCsv = transactionsList.map(item => [item.id, item.description, item.isEnabled ? 'Despesa' : 'Ganho', formatDate(item.date), `${item.isEnabled ? '-' : ''}${item.amount}`])

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
            ['Minhas finanças'],
            ['Identificador', 'Descrição', 'Tipo', 'Data', 'Valor'],
            ...dataCsv,
            ['', '', '', 'Total:', `${TotalList}`],
            ['', '', '', 'Dizimo:', `${Tithe}`],
        ]);
        XLSX.utils.book_append_sheet(wb, ws, "Financas");
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })

        let fileUri = FileSystem.documentDirectory + "financas.xlsx";

        try {
            FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 })
                .then(() => {
                    ToastAndroid.show('Exportado com sucesso', ToastAndroid.SHORT);
                    Sharing.shareAsync(fileUri)
                })


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
                    exportDataToExcel()
                } else {
                    ToastAndroid.show('Permissão Negada', ToastAndroid.SHORT);
                }
            }
            else {
                exportDataToExcel()
            }
        } catch (error) {
            ToastAndroid.show('Houve um problema', ToastAndroid.SHORT);
            console.log("Error while check permissions")
            console.log(error)
            return
        }
    }

    return (
        <Menu>
            <ScrollView
                style={styles.ScrollViewContainer}
            >
                <ImageBackground source={bgImg} style={styles.header}>
                    <View style={styles.headerItens}>
                        <Text style={styles.title}>Sobre mim</Text>
                    </View>
                </ImageBackground>
                <View style={styles.imageContainer}>
                    <View style={styles.imageBorder} >
                        <View style={styles.imageBackgroundWhite}>
                            <Image source={userImg} style={styles.image} />
                        </View>
                    </View>
                </View>
                <RectButton onPress={handleOpenCSV} style={styles.button}>
                    <Feather name="globe" size={24} style={{ marginRight: 6 }} color="#FFF" />
                    <Text style={styles.buttonText} >
                        Exportar finanças
                    </Text>
                </RectButton>
                <RectButton onPress={() => { Linking.openURL("https://desenvolvedordeaplicativos.com.br/") }} style={styles.button}>
                    <Feather name="globe" size={24} style={{ marginRight: 6 }} color="#FFF" />
                    <Text style={styles.buttonText} >
                        Sobre
                    </Text>
                </RectButton>
            </ScrollView>
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
        alignItems: 'center'
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
    },
    header: {
        height: 150,
        width: '100%',
        backgroundColor: '#9c44dc',
    },
    headerItens: {
        marginHorizontal: 24,
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
        marginVertical: 4,
        backgroundColor: '#9c44dc',
        paddingHorizontal: 48,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        color: '#f0f2f5',
        textAlign: 'center',
    },
})