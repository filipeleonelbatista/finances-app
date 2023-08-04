import React, { useMemo } from "react";

import { Feather } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFormik } from "formik";
import {
  Button,
  Input,
  ScrollView,
  Text,
  useColorModeValue,
  useTheme,
  VStack,
} from "native-base";
import * as Yup from "yup";
import { useMarket } from "../hooks/useMarket";
import { useSettings } from "../hooks/useSettings";

export default function AddShoppingCartItem({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { addTrasaction } = useMarket();

  const { marketSimplifiedItems } = useSettings();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Descrição é obrigatório"),
      amount: Yup.string().required("O campo Valor é obrigatório"),
      category: Yup.string().required("O campo Categoria é obrigatório"),
      quantity: Yup.string().required("O campo Quantidade é obrigatório"),
      quantityDesired: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      description: "",
      amount: "0,00",
      category: "Mercearia",
      quantity: "1",
      quantityDesired: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    const data = {
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      quantity: parseInt(formValues.quantity),
      description: formValues.description,
      category: formValues.category,
      quantityDesired: !!formValues.quantityDesired
        ? parseInt(formValues.quantityDesired)
        : "",
    };
    addTrasaction(data);
    onClose();
  }

  function moeda(e) {
    let value = e;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
  }

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Adicionar produto ao estoque
      </Text>
      <Text color={text} mb={4}>
        Adicione itens para suas compras de mercado.
      </Text>

      <VStack space={2}>
        <VStack space={2}>
          <Text color={text}>Descrição</Text>
          <Input
            errors={!!formik.errors.description}
            helperText={formik.errors.description}
            placeholder="Descrição"
            onChangeText={(text) => formik.setFieldValue("description", text)}
            value={formik.values.description}
          />
          {formik.errors.description && (
            <Text color="red.600">{formik.errors.description}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text color={text}>Categoria</Text>
          <Picker
            selectedValue={formik.values.category ?? "Mercearia"}
            onValueChange={(itemValue, itemIndex) =>
              formik.setFieldValue("category", itemValue)
            }
            mode="dropdown"
            dropdownIconColor={theme.colors.purple[600]}
            dropdownIconRippleColor={theme.colors.purple[600]}
            enabled
            style={{
              width: "100%",
              borderRadius: 4,
              color: text,
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
            <Text color="red.600">{formik.errors.category}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text color={text}>Valor</Text>
          <Input
            errors={!!formik.errors.amount}
            helperText={formik.errors.amount}
            placeholder="Valor"
            keyboardType="decimal-pad"
            onChangeText={(text) => formik.setFieldValue("amount", moeda(text))}
            value={formik.values.amount}
          />

          {formik.errors.amount && (
            <Text color="red.600">{formik.errors.amount}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text color={text}>Quantidade</Text>
          <Input
            errors={!!formik.errors.quantity}
            helperText={formik.errors.quantity}
            placeholder="Quantidade"
            keyboardType="decimal-pad"
            onChangeText={(text) => formik.setFieldValue("quantity", text)}
            value={formik.values.quantity}
          />

          {formik.errors.quantity && (
            <Text color="red.600">{formik.errors.quantity}</Text>
          )}
        </VStack>

        {!marketSimplifiedItems && (
          <VStack space={2}>
            <Text color={text}>Quantidade desejada</Text>
            <Input
              errors={!!formik.errors.quantityDesired}
              helperText={formik.errors.quantityDesired}
              placeholder="Quantidade desejada"
              keyboardType="decimal-pad"
              onChangeText={(text) =>
                formik.setFieldValue("quantityDesired", text)
              }
              value={formik.values.quantityDesired}
            />
            {formik.errors.quantityDesired && (
              <Text color="red.600">{formik.errors.quantityDesired}</Text>
            )}
          </VStack>
        )}
        <Button
          onPress={formik.submitForm}
          colorScheme="purple"
          mt={2}
          mb={8}
          _text={{
            color: "white",
          }}
          _pressed={{
            bgColor: theme.colors.purple[900],
          }}
        >
          Adicionar
        </Button>
      </VStack>
    </ScrollView>
  );
}
