
import React, { useMemo } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import { Button, HStack, Input, ScrollView, Text, VStack, useColorModeValue, useTheme } from 'native-base';
import { Switch } from 'react-native';
import * as Yup from 'yup';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';

export default function AddItemForm({ onClose }) {
    const theme = useTheme();
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const { addTrasaction, categoriesList } = usePayments();
    const { simpleFinancesItem } = useSettings();

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
            category: 'Outros',
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
            category: formValues.isEnabled ? formValues.category : 'Ganhos',
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
        <ScrollView
            w={'100%'}
            px={4}
        >
            <Text bold fontSize={24} color={text}>
                Adicionar transação
            </Text>
            <Text color={text} mb={4}>
                Adicione informações sobre o entrada ou saída que está adicionando.
            </Text>

            <VStack space={2}>
                <Text color={text}>
                    Descrição
                </Text>
                <Input
                    errors={!!formik.errors.description}
                    helperText={formik.errors.description}
                    placeholder="Descrição"
                    onChangeText={(text) => formik.setFieldValue('description', text)}
                    value={formik.values.description}
                />
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Valor
                </Text>
                <Input
                    errors={!!formik.errors.amount}
                    helperText={formik.errors.amount}
                    keyboardType="decimal-pad"
                    placeholder="Valor"
                    onChangeText={(text) => formik.setFieldValue('amount', moeda(text))}
                    value={formik.values.amount}
                />
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Data de vencimento
                </Text>
                <Input
                    errors={!!formik.errors.date}
                    helperText={formik.errors.date}
                    placeholder="DD/MM/AAAA"
                    value={formik.values.date}
                    editable={false}
                    rightElement={
                        <Button
                            size="xs"
                            rounded="none"
                            w="1/4"
                            p={0}
                            h="full"
                            bgColor={theme.colors.purple[600]}
                            onPress={() => {
                                DateTimePickerAndroid.open({
                                    value: new Date(Date.now()),
                                    onChange,
                                    mode: 'date',
                                    is24Hour: false,
                                });
                            }}
                        >
                            <Feather name="calendar" size={24} color="#FFF" />
                        </Button>
                    }
                />
            </VStack>

            {
                !simpleFinancesItem && (
                    <>
                        <VStack space={2}>
                            <Text bold fontSize={18} color={text}>
                                Categoria
                            </Text>
                            <Picker
                                selectedValue={formik.values.category ?? 'Outros'}
                                onValueChange={(itemValue, itemIndex) =>
                                    formik.setFieldValue("category", itemValue)
                                }
                                mode='dropdown'
                                dropdownIconColor={theme.colors.purple[600]}
                                dropdownIconRippleColor={theme.colors.purple[600]}
                                enabled
                                style={{
                                    width: '100%',
                                    borderRadius: 4, color: text
                                }}
                            >
                                {
                                    categoriesList.map((cat, index) => (
                                        index === 0 ? null : <Picker.Item key={index} label={cat} value={cat} />
                                    ))
                                }
                            </Picker>
                        </VStack>
                        <VStack space={2}>
                            <Text color={text}>
                                Data do pagamento
                            </Text>
                            <Input
                                errors={!!formik.errors.paymentDate}
                                helperText={formik.errors.paymentDate}
                                placeholder="DD/MM/AAAA"
                                value={formik.values.paymentDate}
                                editable={false}
                                rightElement={
                                    <Button
                                        size="xs"
                                        rounded="none"
                                        w="1/4"
                                        p={0}
                                        h="full"
                                        bgColor={theme.colors.purple[600]}
                                        onPress={() => {
                                            DateTimePickerAndroid.open({
                                                value: new Date(Date.now()),
                                                onChange: onChangePaymentDate,
                                                mode: 'date',
                                                is24Hour: false,
                                            });
                                        }}
                                    >
                                        <Feather name="calendar" size={24} color="#FFF" />
                                    </Button>
                                }
                            />
                        </VStack>
                    </>
                )
            }

            <HStack space={2} alignItems="center">
                <Switch
                    trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                    thumbColor={formik.values.isEnabled ? theme.colors.purple[600] : theme.colors.gray[800]}
                    ios_backgroundColor={theme.colors.gray[800]}
                    onValueChange={toggleSwitch}
                    value={formik.values.isEnabled}
                />
                <Text fontSize={14} color={text}>É despesa?</Text>
            </HStack>
            <Text fontSize={14} color={text}>Deixe marcado caso esteja adicionando uma saída (Despesa).</Text>

            {
                !simpleFinancesItem && (
                    <HStack space={2} alignItems="center">
                        <Switch
                            trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                            thumbColor={formik.values.paymentStatus ? theme.colors.purple[600] : theme.colors.gray[800]}
                            ios_backgroundColor={theme.colors.gray[800]}
                            onValueChange={toggleSwitchPaymentStatus}
                            value={formik.values.paymentStatus}
                        />
                        <Text fontSize={14} color={text}>Foi Pago?</Text>
                    </HStack>
                )
            }
            <Button onPress={formik.submitForm} colorScheme="purple" mb={8}>
                <Text fontSize={14}>Adicionar</Text>
            </Button>
        </ScrollView>
    );
}