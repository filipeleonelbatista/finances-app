
import React, { useMemo, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { useGoals } from '../hooks/useGoals';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

export default function EditGoalForm({ onClose, selectedTransaction }) {
    const [isEditable, setIsEditable] = useState(false)

    const {
        currentTheme
    } = useTheme();

    const { simpleFinancesItem } = useSettings();

    function moeda(e) {
        let value = String(e);
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1,$2");
        value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        return value;
    }

    const { updateTransaction, deleteTransaction } = useGoals();

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            currentAmount: Yup.string(),
            date: Yup.string(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: selectedTransaction.description,
            amount: moeda(selectedTransaction.amount.toFixed(2)),
            currentAmount: moeda(selectedTransaction.currentAmount),
            date: selectedTransaction.date !== '' ? new Date(selectedTransaction.date).toLocaleDateString('pt-BR') : '',
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const submittedDate = formValues.date !== '' && formValues.date.split('/')

        const data = {
            ...selectedTransaction,
            currentAmount: parseFloat(formValues.currentAmount.replaceAll('.', '').replace(',', '.')),
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            date: formValues.date !== '' ? new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime() + 43200000 : '',
            description: formValues.description,
        }
        updateTransaction(data)
        onClose()
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
            <Text style={{ ...styles.label, fontSize: 20, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                {isEditable ? 'Editar' : 'Visualizar'} meta
            </Text>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                {isEditable ? 'Edite' : 'Visualize'} informações sobre sua meta para manter atualizada.
            </Text>

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
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    onChangeText={(text) => formik.setFieldValue('description', text)}
                    value={formik.values.description}
                />
                {formik.errors.description && (
                    <Text style={styles.helperText}>{formik.errors.description}</Text>
                )}
            </View>
            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Valor da meta</Text>
                <TextInput
                    placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                    style={{
                        ...styles.input,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                    }}
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    keyboardType="decimal-pad"
                    placeholder="Valor da meta"
                    onChangeText={(text) => formik.setFieldValue('amount', moeda(text))}
                    value={formik.values.amount}
                />
            </View>
            {formik.errors.amount && (
                <Text style={styles.helperText}>{formik.errors.amount}</Text>
            )}
            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Valor alcançado</Text>
                <TextInput
                    placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                    style={{
                        ...styles.input,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                    }}
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    keyboardType="decimal-pad"
                    placeholder="Valor alcançado"
                    onChangeText={(text) => formik.setFieldValue('currentAmount', moeda(text))}
                    value={formik.values.currentAmount}
                />
            </View>
            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Data da meta</Text>
                <View style={styles.inputGroup}>
                    <Pressable
                        onPress={() => {
                            !isEditable ? null :
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
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
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
                        !isEditable ? null :
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
            </View>

            {isEditable ? (
                <>
                    <TouchableOpacity onPress={formik.submitForm} style={styles.buttonSave}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => setIsEditable(true)} style={styles.buttonSave}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        deleteTransaction(selectedTransaction)
                        onClose()
                    }} style={styles.buttonDelete}>
                        <Text style={{ ...styles.buttonText, color: '#e83e5a' }}>Deletar</Text>
                    </TouchableOpacity>
                </>
            )}

            <View style={{ height: 16 }} />
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
    buttonDelete: {
        borderRadius: 4,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#e83e5a',
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