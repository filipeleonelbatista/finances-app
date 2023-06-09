
import React, { useMemo, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { useMarket } from '../hooks/useMarket';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';

export default function EditShoppingCartItem({ onClose, selectedTransaction }) {
    const [isEditable, setIsEditable] = useState(false)

    const { marketSimplifiedItems } = useSettings();

    const { updateTransaction, deleteTransaction } = useMarket();

    const {
        currentTheme
    } = useTheme();

    function moeda(e) {
        let value = String(e);
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1,$2");
        value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        return value;
    }

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            category: Yup.string().required("O campo Categoria é obrigatório"),
            quantity: Yup.string().required("O campo Quantidade é obrigatório"),
            quantityDesired: Yup.string(),
            date: Yup.string(),
            location: Yup.string(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: selectedTransaction.description,
            amount: moeda(selectedTransaction.amount.toFixed(2)),
            category: selectedTransaction.category,
            quantity: String(selectedTransaction.quantity),
            quantityDesired: String(selectedTransaction.quantityDesired),
            date: selectedTransaction.date !== '' ? new Date(selectedTransaction.date).toLocaleDateString('pt-BR') : '',
            location: selectedTransaction.location
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const submittedDate = formValues.date === '' ? '' : formValues.date.split('/')

        const data = {
            ...selectedTransaction,
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            quantity: parseInt(formValues.quantity),
            description: formValues.description,
            category: formValues.category,
            quantityDesired: !!formValues.quantityDesired ? parseInt(formValues.quantityDesired) : '',
            location: formValues.location,
            date: formValues.date === '' ? '' : new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime() + 43200000,
        }
        updateTransaction(data)
        onClose()
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('date', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
    };

    return (
        <>
            <Text style={{ ...styles.label, fontSize: 20, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                {isEditable ? 'Editar' : 'Visualizar'} Item
            </Text>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                {isEditable ? 'Edite' : 'Visualize'} itens para suas compras de mercado.
            </Text>

            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Descrição</Text>
                <TextInput
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
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
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Categoria</Text>
                <Picker
                    selectedValue={formik.values.category ?? 'Mercearia'}
                    onValueChange={(itemValue, itemIndex) =>
                        formik.setFieldValue("category", itemValue)
                    }
                    mode='dropdown'
                    dropdownIconColor={'#9c44dc'}
                    dropdownIconRippleColor={'#9c44dc'}
                    enabled={isEditable}
                    style={{
                        width: '100%',
                        borderRadius: 4, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21'
                    }}
                >
                    <Picker.Item label="Carnes" value="Carnes" />
                    <Picker.Item label="Fruteira" value="Fruteira" />
                    <Picker.Item label="Higiêne" value="Higiêne" />
                    <Picker.Item label="Limpeza" value="Limpeza" />
                    <Picker.Item label="Mercearia" value="Mercearia" />
                    <Picker.Item label="Outros" value="Outros" />
                </Picker>
                {formik.errors.category && (
                    <Text style={styles.helperText}>{formik.errors.category}</Text>
                )}
            </View>

            <View>
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Valor</Text>
                <TextInput
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
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
                <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Quantidade</Text>
                <TextInput
                    editable={isEditable}
                    selectTextOnFocus={isEditable}
                    placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                    style={{
                        ...styles.input,
                        backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                        color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                    }}
                    keyboardType="decimal-pad"
                    placeholder="Quantidade"
                    onChangeText={(text) => formik.setFieldValue('quantity', text)}
                    value={formik.values.quantity}
                />
            </View>
            {formik.errors.quantity && (
                <Text style={styles.helperText}>{formik.errors.quantity}</Text>
            )}

            {
                !marketSimplifiedItems && (
                    <>
                        <View>
                            <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Quantidade desejada</Text>
                            <TextInput
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                                placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                                style={{
                                    ...styles.input,
                                    backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                                    color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                                }}
                                keyboardType="decimal-pad"
                                placeholder="Quantidade desejada"
                                onChangeText={(text) => formik.setFieldValue('quantityDesired', text)}
                                value={formik.values.quantityDesired}
                            />
                        </View>
                        {formik.errors.quantityDesired && (
                            <Text style={styles.helperText}>{formik.errors.quantityDesired}</Text>
                        )}

                        <View>
                            <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Local da compra</Text>
                            <TextInput
                                editable={isEditable}
                                selectTextOnFocus={isEditable}
                                placeholderTextColor={currentTheme === 'dark' ? '#FFF' : '#1c1e21'}
                                style={{
                                    ...styles.input,
                                    backgroundColor: currentTheme === 'dark' ? '#1c1e21' : '#FFF',
                                    color: currentTheme === 'dark' ? '#FFF' : '#1c1e21',
                                }}
                                placeholder="Local da compra"
                                onChangeText={(text) => formik.setFieldValue('location', text)}
                                value={formik.values.location}
                            />
                        </View>

                        <View>
                            <Text style={{ ...styles.label, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>Data</Text>
                            <View style={styles.inputGroup}>
                                <Pressable
                                    onPress={() => {
                                        !isEditable ? null : DateTimePickerAndroid.open({
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
                                            editable={isEditable}
                                            selectTextOnFocus={isEditable}
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
                                    !isEditable ? null : DateTimePickerAndroid.open({
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

                    </>
                )
            }

            <View style={{ height: 16 }} />

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