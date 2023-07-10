
import React from 'react';

import { Feather } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { Button, Input, ScrollView, Text, VStack, useColorModeValue, useTheme } from 'native-base';
import { useCallback } from 'react';
import * as Yup from 'yup';
import { useGoals } from '../hooks/useGoals';

export default function AddGoalForm({ onClose }) {
    const theme = useTheme();
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const { addTrasaction } = useGoals();

    const formSchema = useCallback(() => {
        return Yup.object().shape({
            description: Yup.string().required("O campo Descrição é obrigatório"),
            amount: Yup.string().required("O campo Valor é obrigatório"),
            currentAmount: Yup.string(),
            date: Yup.string(),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            description: '',
            amount: '',
            currentAmount: '',
            date: '',
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        const submittedDate = formValues.date !== '' && formValues.date.split('/')
        const data = {
            currentAmount: parseFloat(formValues.currentAmount.replaceAll('.', '').replace(',', '.')),
            amount: parseFloat(formValues.amount.replaceAll('.', '').replace(',', '.')),
            date: formValues.date !== '' ? new Date(`${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`).getTime() + 43200000 : '',
            description: formValues.description,
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

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        formik.setFieldValue('date', `${currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`);
    };


    return (
        <ScrollView
            w={'100%'}
            px={4}
        >
            <Text bold fontSize={24} color={text}>
                Adicionar Meta
            </Text>
            <Text color={text} mb={4}>
                Adicione sua meta para acompanhar em suas finanças.
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
                {formik.errors.description && (
                    <Text color="red.600">{formik.errors.description}</Text>
                )}
            </VStack>
            <VStack space={2}>
                <Text color={text}>
                    Valor da meta
                </Text>
                <Input
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
                {formik.errors.date && (
                    <Text color="red.600">{formik.errors.date}</Text>
                )}
            </VStack>

            <Button
                onPress={formik.submitForm}
                colorScheme="purple"
                mt={2}
                mb={8}
                _text={{
                    color: "white",
                }}
                _pressed={{
                    bgColor: theme.colors.purple[900]
                }}
            >
                Adicionar
            </Button>
        </ScrollView>
    );
}