
import React, { useMemo } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { Dimensions, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { usePayments } from '../hooks/usePayments';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { Picker } from '@react-native-picker/picker';

export default function AddItemForm({ onClose }) {
    const { addTrasaction, categoriesList } = usePayments();
    const { simpleFinancesItem } = useSettings();

    const {
        currentTheme
    } = useTheme();

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            category: Yup.string(),
            date: Yup.string(),
            paymentDate: Yup.string(),
            paymentStatus: Yup.boolean(),
            isEnabled: Yup.boolean(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: '',
            amount: '',
            date: '',
            category: '',
            paymentDate: '',
            paymentStatus: false,
            isEnabled: false
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const submittedDate = formValues.date !== '' && formValues.date.split('/')
        const submittedPaymentDate = formValues.paymentDate !== '' ? formValues.paymentDate.split('/') : ''
        const data = {
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            date: formValues.date !== '' ? new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime() + 43200000 : '',
            paymentDate: formValues.paymentDate !== '' ? new Date(`${submittedPaymentDate[2]}-${submittedPaymentDate[1]}-${submittedPaymentDate[0]}`).getTime() + 43200000 : '',
            description: formValues.description,
            category: formValues.category,
            paymentStatus: formValues.paymentStatus,
            isEnabled: formValues.isEnabled,
            isFavorited: false,
        }
        addTrasaction(data)
        onClose()
    }

    function moeda(e) {
        let value = e;
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1,$2");
        value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        return value;
    }
    const toggleSwitch = () => formik.setFieldValue('isEnabled', !formik.values.isEnabled)
    const toggleSwitchPaymentStatus = () => formik.setFieldValue('paymentStatus', !formik.values.paymentStatus)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('date', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
    };

    const onChangePaymentDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('paymentDate', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
    };

    return (
        <>
            <Text style={{ ...styles.label, fontSize: 20, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Adicionar transação</Text>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Adicione informações sobre o entrada ou saída que está adicionando.</Text>

            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Descrição</Text>
                <TextInput
                    placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                    style={{
                        ...styles.input,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                    }}
                    placeholder="Descrição"
                    onChangeText={(text) => formik.setFieldValue('description', text)}
                    value={formik.values.description}
                />
                {formik.errors.description && (
                    <Text style={styles.helperText}>{formik.errors.description}</Text>
                )}
            </View>
            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Valor</Text>
                <TextInput
                    placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                    style={{
                        ...styles.input,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                    }}
                    keyboardType="decimal-pad"
                    placeholder="Valor"
                    onChangeText={(text) => formik.setFieldValue('amount', moeda(text))}
                    value={formik.values.amount}
                />
            </View>
            {formik.errors.amount && (
                <Text style={styles.helperText}>{formik.errors.amount}</Text>
            )}
            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Data de vencimento</Text>
                <View style={styles.inputGroup}>
                    <Pressable
                        onPress={() => {
                            DateTimePickerAndroid.open({
                                themeVariant: currentTheme,
                                value: new Date(Date.now()),
                                onChange,
                                mode: 'date',
                                is24Hour: false,
                            });
                        }}
                        style={{
                            width: '82%',
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                            }}
                            pointerEvents='none'
                        >
                            <TextInput
                                placeholder="dd/mm/aaaa"
                                keyboardType="decimal-pad"
                                maxLength={10}
                                value={formik.values.date}

                                placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                                style={{
                                    ...styles.inputInputGroup,
                                    width: '100%',
                                    backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                                    color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                                }}
                            />
                        </View>
                    </Pressable>
                    <TouchableOpacity onPress={() => {
                        DateTimePickerAndroid.open({
                            themeVariant: currentTheme,
                            value: new Date(Date.now()),
                            onChange,
                            mode: 'date',
                            is24Hour: false,
                        });
                    }} style={styles.buttonInputGroup}>
                        <Feather name="calendar" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {formik.errors.date && (
                    <Text style={styles.helperText}>{formik.errors.date}</Text>
                )}
            </View>

            {
                !simpleFinancesItem && (
                    <>
                        <View>
                            <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Categoria</Text>
                            <Picker
                                selectedValue={formik.values.category ?? 'Outros'}
                                onValueChange={(itemValue, itemIndex) =>
                                    formik.setFieldValue("category", itemValue)
                                }
                                mode='dropdown'
                                dropdownIconColor={'#9c44dc'}
                                dropdownIconRippleColor={'#9c44dc'}
                                enabled
                                style={{
                                    width: '100%',
                                    borderRadius: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21'
                                }}
                            >
                                {
                                    categoriesList.map((cat, index) => (
                                        index === 0 ? null : <Picker.Item key={index} label={cat} value={cat} />
                                    ))
                                }
                            </Picker>
                        </View>
                        <View>
                            <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Data do pagamento</Text>
                            <View style={styles.inputGroup}>
                                <Pressable
                                    onPress={() => {
                                        DateTimePickerAndroid.open({
                                            themeVariant: currentTheme,
                                            value: new Date(Date.now()),
                                            onChange: onChangePaymentDate,
                                            mode: 'date',
                                            is24Hour: false,
                                        });
                                    }}
                                    style={{
                                        width: '82%',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '100%',
                                        }}
                                        pointerEvents='none'
                                    >
                                        <TextInput
                                            placeholder="dd/mm/aaaa"
                                            keyboardType="decimal-pad"
                                            maxLength={10}
                                            value={formik.values.paymentDate}

                                            placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                                            style={{
                                                ...styles.inputInputGroup,
                                                width: '100%',
                                                backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                                                color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                                            }}
                                        />
                                    </View>
                                </Pressable>
                                <TouchableOpacity onPress={() => {
                                    DateTimePickerAndroid.open({
                                        themeVariant: currentTheme,
                                        value: new Date(Date.now()),
                                        onChange: onChangePaymentDate,
                                        mode: 'date',
                                        is24Hour: false,
                                    });
                                }} style={styles.buttonInputGroup}>
                                    <Feather name="calendar" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )
            }

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                    trackColor={{ false: "#767577", true: "#767577" }}
                    thumbColor={formik.values.isEnabled ? "#9c44dc" : "#3e3e3e"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={formik.values.isEnabled}
                />
                <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>É despesa?</Text>
            </View>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Deixe marcado caso esteja adicionando uma saída (Despesa).</Text>

            {
                !simpleFinancesItem && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#767577" }}
                            thumbColor={formik.values.paymentStatus ? "#9c44dc" : "#3e3e3e"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchPaymentStatus}
                            value={formik.values.paymentStatus}
                        />
                        <Text style={{ ...styles.labelSwitch, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Foi Pago?</Text>
                    </View>
                )
            }
            <TouchableOpacity onPress={formik.submitForm} style={styles.buttonSave}>
                <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#f0f2f5',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    inputInputGroup: {
        marginTop: 6,
        paddingHorizontal: 12,
        backgroundColor: '#FFF',
        borderColor: "#CCC",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 0,
        width: '81%',
        height: 48,
        borderWidth: 1
    },
    buttonInputGroup: {
        marginTop: 6,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9c44dc',
        borderColor: "#9c44dc",
        borderWidth: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 8,
    },
    buttonCancel: {
        borderRadius: 4,
        marginVertical: 6,
        backgroundColor: '#FFF',
        borderColor: "#F00",
        borderWidth: 1,
        paddingHorizontal: 48,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSave: {
        borderRadius: 4,
        marginVertical: 6,
        backgroundColor: '#9c44dc',
        paddingHorizontal: 48,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        fontWeight: '600',
        color: '#363f5f'
    },
    label: {
        marginTop: 18,
        fontSize: 18,
        color: '#363f5f',
        fontFamily: 'Poppins_400Regular',
    },
    labelSwitch: {
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
    title: {
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        fontSize: 32,
        color: '#f0f2f5',
        marginVertical: 24,
    },
    ScrollViewContainer: {
        width: '100%',
        height: 'auto',
        marginTop: -108,
    },
    header: {
        paddingTop: 12,
        height: 192,
        width: '100%',
        backgroundColor: '#2D4A22',
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
        backgroundColor: '#49AA26',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerButtonText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#f0f2f5',
    },
    cardWite: {
        marginTop: -100,
        borderRadius: 4,
        marginHorizontal: 24,
        marginVertical: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    cardGreen: {
        borderRadius: 4,
        marginHorizontal: 24,
        marginVertical: 6,
        backgroundColor: '#49AA26',
        paddingHorizontal: 48,
        paddingVertical: 24,
    },
    cardTextGreen: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f0f2f5',
        marginBottom: 24,
    },
    cardValueGreen: {
        fontSize: 32,
        fontWeight: '600',
        color: '#f0f2f5'
    },
    cardText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#363f5f',
        marginBottom: 24,
    },
    cardValue: {
        fontSize: 32,
        fontWeight: '600',
        color: '#363f5f'
    },
    statusBar: {
        height: 24,
        width: '100%',
        backgroundColor: '#2D4A22',
    },
    button: {
        borderRadius: 48,
        marginHorizontal: 24,
        marginVertical: 12,
        backgroundColor: '#49AA26',
        paddingHorizontal: 48,
        paddingVertical: 24,
    },
    buttonText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
        color: '#f0f2f5',
        textAlign: 'center',
    },
    buttonTextCancel: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
        color: '#F00',
        textAlign: 'center',
    },
    helperText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
    },
})