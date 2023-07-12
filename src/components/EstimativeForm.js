
import React, { useMemo } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, ScrollView, Text, VStack, useColorModeValue, useTheme } from 'native-base';
import { useMarket } from '../hooks/useMarket';

export default function EstimativeForm({ onClose }) {
    const theme = useTheme();
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const { setEstimativeValue, estimative } = useMarket();

    function moeda(e) {
        let value = e;
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1,$2");
        value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        return value;
    }

    const formSchema = useMemo(() => {
        return Yup.object().shape({
            estimative: Yup.string().required("O campo Valor estimado é obrigatório"),
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            estimative: estimative.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
            }).replace("R$ ", ""),
        },
        validationSchema: formSchema,
        onSubmit: values => {
            handleSubmitForm(values)
        },
    });

    async function handleSubmitForm(formValues) {
        setEstimativeValue(parseFloat(formValues.estimative.replaceAll('.', '').replace(',', '.')))
        onClose()
    }

    return (
        <ScrollView
            w={'100%'}
            px={4}
        >
            <Text bold fontSize={24} color={text}>
                Adicionar produto
            </Text>
            <Text color={text} mb={4}>
                Adicione itens para suas compras de mercado.
            </Text>

            <VStack space={2}>
                <VStack space={2}>
                    <Text color={text}>
                        Valor de gastos estimado
                    </Text>
                    <Input
                        errors={!!formik.errors.estimative}
                        helperText={formik.errors.estimative}
                        keyboardType="decimal-pad"
                        placeholder="Valor de gastos estimado"
                        onChangeText={(text) => formik.setFieldValue('estimative', moeda(text))}
                        value={formik.values.estimative}
                    />
                    {formik.errors.estimative && (
                        <Text color="red.600">{formik.errors.estimative}</Text>
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
                    Atualizar
                </Button>
            </VStack>
        </ScrollView>
    );
}