
import React, { useMemo } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { Dimensions, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { usePayments } from '../hooks/usePayments';

export default function AddItemForm({ onClose }) {
    const { addTrasaction } = usePayments();

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            date: Yup.string().required("O campo Data é obrigatório"),
            isEnabled: Yup.boolean(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: '',
            amount: '',
            date: '',
            isEnabled: false
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const submittedDate = formValues.date.split('/')
        const data = {
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            date: new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime(),
            description: formValues.description,
            isEnabled: formValues.isEnabled,
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

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('date', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
    };

    return (
        <>
            <Text style={{ ...styles.label, fontSize: 20, marginTop: 0 }}>Adicionar transação</Text>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0 }}>Adicione informações sobre o entrada ou saída que está adicionando.</Text>

            <View>
                <Text style={styles.label}>Descrição</Text>
                <TextInput style={styles.input}
                    placeholder="Descrição"
                    onChangeText={(text) => formik.setFieldValue('description', text)}
                    value={formik.values.description}
                />
                {formik.errors.description && (
                    <Text style={styles.helperText}>{formik.errors.description}</Text>
                )}
            </View>
            <View>
                <Text style={styles.label}>Valor</Text>
                <TextInput style={styles.input}
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
                <Text style={styles.label}>Data</Text>
                <View style={styles.inputGroup}>
                    <Pressable
                        onPress={() => {
                            DateTimePickerAndroid.open({
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
                                style={{ ...styles.inputInputGroup, width: '100%' }}
                            />
                        </View>
                    </Pressable>
                    <TouchableOpacity onPress={() => {
                        DateTimePickerAndroid.open({
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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch
                    trackColor={{ false: "#767577", true: "#767577" }}
                    thumbColor={formik.values.isEnabled ? "#9c44dc" : "#3e3e3e"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={formik.values.isEnabled}
                />
                <Text style={styles.labelSwitch}>É despesa?</Text>
            </View>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0 }}>Deixe marcado caso esteja adicionando uma saída (Despesa).</Text>

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