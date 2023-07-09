
import React, { useMemo, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import { Box, Button, HStack, IconButton, Input, ScrollView, Text, VStack, useColorModeValue, useTheme } from 'native-base';
import { Switch, View } from 'react-native';
import * as Yup from 'yup';
import { usePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';

export default function EditItemForm({ onClose, selectedTransaction }) {
    const theme = useTheme();
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const [isEditable, setIsEditable] = useState(false)

    const { simpleFinancesItem } = useSettings();

    function moeda(e) {
        let value = String(e);
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1,$2");
        value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        return value;
    }

    const { updateTransaction, deleteTransaction, categoriesList } = usePayments();

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            date: Yup.string(),
            category: Yup.string(),
            paymentDate: Yup.string(),
            paymentStatus: Yup.boolean(),
            isEnabled: Yup.boolean(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: selectedTransaction.description,
            amount: moeda(selectedTransaction.amount.toFixed(2)),
            date: selectedTransaction.date !== '' ? new Date(selectedTransaction.date).toLocaleDateString('pt-BR') : '',
            paymentDate: selectedTransaction.paymentDate !== '' ? new Date(selectedTransaction.paymentDate).toLocaleDateString('pt-BR') : '',
            paymentStatus: selectedTransaction.paymentStatus,
            category: selectedTransaction.category ?? 'Outros',
            isEnabled: selectedTransaction.isEnabled
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
            ...selectedTransaction,
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            date: formValues.date !== '' ? new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime() + 43200000 : '',
            paymentDate: formValues.paymentDate !== '' ? new Date(`${submittedPaymentDate[2]}-${submittedPaymentDate[1]}-${submittedPaymentDate[0]}`).getTime() + 43200000 : '',
            description: formValues.description,
            category: formValues.isEnabled ? formValues.category : 'Ganhos',
            paymentStatus: formValues.paymentStatus,
            isEnabled: formValues.isEnabled,
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
        <ScrollView
            w={'100%'}
            px={4}
        >
            <HStack space={2} mb={2} justifyContent="space-between">
                {
                    !isEditable ? (
                        <IconButton
                            onPress={() => setIsEditable(true)}
                            _pressed={{
                                bgColor: 'green.300'
                            }}
                            icon={<Feather name="edit" size={24} color={theme.colors.green[500]} />}
                            borderRadius={4}
                            borderWidth={1}
                            borderColor={theme.colors.green[500]}
                        />
                    ) : <Box w={10} />
                }
                <Text bold fontSize={24} color={text}>
                    {isEditable ? 'Editar' : 'Visualizar'} transação
                </Text>
                <IconButton
                    onPress={() => {
                        deleteTransaction(selectedTransaction)
                        onClose()
                    }}
                    _pressed={{
                        bgColor: 'red.300'
                    }}
                    icon={<Feather name="trash" size={24} color={theme.colors.red[500]} />}
                    borderRadius={4}
                    borderWidth={1}
                    borderColor={theme.colors.red[500]}
                />
            </HStack>
            <Text color={text} mb={2}>
                {isEditable ? 'Edite' : 'Visualize'} informações sobre o entrada ou saída selecionada.
            </Text>
            <VStack space={2}>
                <Text color={text}>
                    Descrição
                </Text>
                <Input
                    isDisabled={!isEditable}
                    errors={!!formik.errors.description}
                    helperText={formik.errors.description}
                    placeholder="Descrição"
                    onChangeText={(text) => formik.setFieldValue('description', text)}
                    value={formik.values.description}
                />
                {formik.errors.description && (
                    <Text color="red.600">{formik.errors.description}</Text>
                )}
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Valor
                </Text>
                <Input
                    isDisabled={!isEditable}
                    errors={!!formik.errors.amount}
                    helperText={formik.errors.amount}
                    keyboardType="decimal-pad"
                    placeholder="Valor"
                    onChangeText={(text) => formik.setFieldValue('amount', moeda(text))}
                    value={formik.values.amount}
                />
                {formik.errors.amount && (
                    <Text color="red.600">{formik.errors.amount}</Text>
                )}
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Data de vencimento
                </Text>
                <Input
                    isDisabled={!isEditable}
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
                                isEditable &&
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
                {formik.errors.date && (
                    <Text color="red.600">{formik.errors.date}</Text>
                )}
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
                                enabled={isEditable}
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
                            {formik.errors.category && (
                                <Text color="red.600">{formik.errors.category}</Text>
                            )}
                        </VStack>
                        <VStack space={2}>
                            <Text color={text}>
                                Data do pagamento
                            </Text>
                            <Input
                                isDisabled={!isEditable}
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
                                            isEditable &&
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
                            {formik.errors.paymentDate && (
                                <Text color="red.600">{formik.errors.paymentDate}</Text>
                            )}
                        </VStack>
                    </>
                )
            }

            <HStack space={2} alignItems="center">
                <Switch
                    disabled={!isEditable}
                    trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                    thumbColor={formik.values.isEnabled ? theme.colors.purple[600] : theme.colors.gray[800]}
                    ios_backgroundColor={theme.colors.gray[800]}
                    onValueChange={toggleSwitch}
                    value={formik.values.isEnabled}
                />
                <Text fontSize={14} color={text}>É despesa?</Text>
            </HStack>
            {formik.errors.isEnabled && (
                <Text color="red.600">{formik.errors.isEnabled}</Text>
            )}
            <Text fontSize={14} color={text}>Deixe marcado caso esteja adicionando uma saída (Despesa).</Text>

            {
                !simpleFinancesItem && (
                    <>
                        <HStack space={2} alignItems="center">
                            <Switch
                                disabled={!isEditable}
                                trackColor={{ false: theme.colors.gray[400], true: theme.colors.gray[400] }}
                                thumbColor={formik.values.paymentStatus ? theme.colors.purple[600] : theme.colors.gray[800]}
                                ios_backgroundColor={theme.colors.gray[800]}
                                onValueChange={toggleSwitchPaymentStatus}
                                value={formik.values.paymentStatus}
                            />
                            <Text fontSize={14} color={text}>Foi Pago?</Text>
                        </HStack>
                        {formik.errors.paymentStatus && (
                            <Text color="red.600">{formik.errors.paymentStatus}</Text>
                        )}
                    </>
                )
            }

            {isEditable && (
                <Button onPress={formik.submitForm} colorScheme="purple">
                    Salvar
                </Button>
            )}

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}