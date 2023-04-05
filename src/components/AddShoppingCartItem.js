
import React, { useMemo } from 'react';

import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { useMarket } from '../hooks/useMarket';
import { useTheme } from '../hooks/useTheme';

export default function AddShoppingCartItem({ onClose }) {
    const { addTrasaction } = useMarket();

    const {
        currentTheme
    } = useTheme();

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            category: Yup.string().required("O campo Categoria é obrigatório"),
            quantity: Yup.string().required("O campo Quantidade é obrigatório"),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: '',
            amount: '0,00',
            category: 'Mercearia',
            quantity: '1'
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const data = {
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            quantity: parseInt(formValues.quantity),
            description: formValues.description,
            category: formValues.category,
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

    return (
        <>
            <Text style={{ ...styles.label, fontSize: 20, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                Adicionar Item
            </Text>
            <Text style={{ ...styles.label, fontSize: 14, marginTop: 0, color: currentTheme === 'dark' ? '#FFF' : '#1c1e21' }}>
                Adicione itens para suas compras de mercado.
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
                    enabled
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

            <TouchableOpacity onPress={formik.submitForm} style={{ ...styles.buttonSave, marginTop: 16 }}>
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