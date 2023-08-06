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
import { useLists } from "../hooks/useLists";
import { useSettings } from "../hooks/useSettings";
import { ToastAndroid } from "react-native";

export default function AddItemListItem({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { addItemToList, selectedList } = useLists();

  const { marketSimplifiedItems } = useSettings();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Descrição é obrigatório"),
      amount: Yup.string().required("O campo Valor é obrigatório"),
      category: Yup.string().required("O campo Categoria é obrigatório"),
      quantity: Yup.string().required("O campo Quantidade é obrigatório"),
      quantityDesired: Yup.string(),
      location: Yup.string(),
      date: Yup.string(),
    });
  }, []);
  const startedDate = new Date();

  const formik = useFormik({
    initialValues: {
      description: "",
      amount: "0,00",
      category: "Mercearia",
      quantity: "1",
      quantityDesired: "",
      location: selectedList.location ?? "",
      date: `${
        startedDate.getDate() < 10
          ? "0" + startedDate.getDate()
          : startedDate.getDate()
      }/${
        startedDate.getMonth() + 1 < 10
          ? "0" + (startedDate.getMonth() + 1)
          : startedDate.getMonth() + 1
      }/${startedDate.getFullYear()}`,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    const submittedDate = formValues.date !== "" && formValues.date.split("/");

    const data = {
      list_id: selectedList.id,
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      quantity: parseInt(formValues.quantity),
      description: formValues.description,
      category: formValues.category,
      quantityDesired: !!formValues.quantityDesired
        ? parseInt(formValues.quantityDesired)
        : "",
      location: formValues.location,
      date:
        new Date(
          `${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`
        ).getTime() + 43200000,
    };

    await addItemToList(data);

    ToastAndroid.show("Item adicionado com sucesso", ToastAndroid.SHORT);
    onClose();
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
    formik.setFieldValue(
      "date",
      `${
        currentDate.getDate() < 10
          ? "0" + currentDate.getDate()
          : currentDate.getDate()
      }/${
        currentDate.getMonth() + 1 < 10
          ? "0" + (currentDate.getMonth() + 1)
          : currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`
    );
  };

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Adicionar item na lista
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
          <>
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

            <VStack space={2}>
              <Text color={text}>Local de compra</Text>
              <Input
                errors={!!formik.errors.location}
                helperText={formik.errors.location}
                placeholder="Local de compra"
                onChangeText={(text) => formik.setFieldValue("location", text)}
                value={formik.values.location}
              />
              {formik.errors.location && (
                <Text color="red.600">{formik.errors.location}</Text>
              )}
            </VStack>

            <VStack space={2}>
              <Text color={text}>Data de compra</Text>
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
                    _pressed={{
                      bgColor: 'purple.800'
                    }}
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        value: new Date(Date.now()),
                        onChange,
                        mode: "date",
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
          </>
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
