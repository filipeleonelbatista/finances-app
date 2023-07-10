
import React, { useMemo, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { Box, Button, HStack, IconButton, Input, ScrollView, Text, VStack, useColorModeValue, useTheme } from 'native-base';
import * as Yup from 'yup';
import { useGoals } from '../hooks/useGoals';

export default function EditGoalForm({ onClose, selectedTransaction }) {
    const theme = useTheme();
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const [isEditable, setIsEditable] = useState(false)

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

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('date', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
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
                    {isEditable ? 'Editar' : 'Visualizar'} meta
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
            <Text color={text} mb={4}>
                Adicione sua meta para acompanhar em suas finanças.
            </Text>

            <VStack space={2}>
                <Text color={text}>
                    Descrição
                </Text>
                <Input
                    editable={isEditable}
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
                    Valor da meta
                </Text>
                <Input
                    editable={isEditable}
                    isDisabled={!isEditable}
                    errors={!!formik.errors.amount}
                    helperText={formik.errors.amount}
                    keyboardType="decimal-pad"
                    placeholder="Valor da meta"
                    onChangeText={(text) => formik.setFieldValue('amount', moeda(text))}
                    value={formik.values.amount}
                />
                {formik.errors.amount && (
                    <Text color="red.600">{formik.errors.amount}</Text>
                )}
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Valor alcançado
                </Text>
                <Input
                    editable={isEditable}
                    isDisabled={!isEditable}
                    errors={!!formik.errors.currentAmount}
                    helperText={formik.errors.currentAmount}
                    keyboardType="decimal-pad"
                    placeholder="Valor alcançado"
                    onChangeText={(text) => formik.setFieldValue('currentAmount', moeda(text))}
                    value={formik.values.currentAmount}
                />
                {formik.errors.currentAmount && (
                    <Text color="red.600">{formik.errors.currentAmount}</Text>
                )}
            </VStack>

            <VStack space={2}>
                <Text color={text}>
                    Data da meta
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
            {isEditable && (
                <Button onPress={formik.submitForm} colorScheme="purple" mt={2} mb={8}>
                    <Text fontSize={14}>Salvar</Text>
                </Button>
            )}
        </ScrollView>
    );
}
