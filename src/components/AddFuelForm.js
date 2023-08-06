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
import { useRuns } from "../hooks/useRuns";

export default function AddFuelForm({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { addTransaction } = useRuns();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      currentDistance: Yup.string().required("O campo Km Atual é obrigatório"),
      unityAmount: Yup.string().required(
        "O campo Valor do litro é obrigatório"
      ),
      amount: Yup.string().required("O campo Valor Pago é obrigatório"),
      type: Yup.string().required("O campo Tipo do combustível é obrigatório"),
      date: Yup.string().required("O campo Data é obrigatório"),
      location: Yup.string().required("O campo Local é obrigatório"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      currentDistance: "",
      unityAmount: "",
      amount: "",
      type: "Gasolina comum",
      date: `${
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate()
      }/${
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      location: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    const submittedDate = formValues.date.split("/");
    const data = {
      currentDistance: parseFloat(
        formValues.currentDistance.replaceAll(".", "").replace(",", ".")
      ),
      type: formValues.type,
      unityAmount: parseFloat(
        formValues.unityAmount.replaceAll(".", "").replace(",", ".")
      ),
      amount: parseFloat(
        formValues.amount.replaceAll(".", "").replace(",", ".")
      ),
      date:
        new Date(
          `${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`
        ).getTime() + 43200000,
      location: formValues.location,
    };
    addTransaction(data);
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
        Adicionar abastecimento
      </Text>
      <Text color={text} mb={4}>
        Adicione informações sobre o abastecimento.
      </Text>

      <VStack space={2}>
        <Text color={text}>Local</Text>
        <Input
          errors={!!formik.errors.location}
          helperText={formik.errors.location}
          placeholder="Local"
          onChangeText={(text) => formik.setFieldValue("location", text)}
          value={formik.values.location}
        />
        {formik.errors.location && (
          <Text color="red.600">{formik.errors.location}</Text>
        )}
      </VStack>

      <VStack space={2}>
        <Text color={text}>Km Atual</Text>
        <Input
          errors={!!formik.errors.currentDistance}
          helperText={formik.errors.currentDistance}
          keyboardType="decimal-pad"
          placeholder="Km Atual"
          onChangeText={(text) => formik.setFieldValue("currentDistance", text)}
          value={formik.values.currentDistance}
        />
        {formik.errors.currentDistance && (
          <Text color="red.600">{formik.errors.currentDistance}</Text>
        )}
      </VStack>

      <VStack space={2}>
        <Text color={text}>Valor do litro</Text>
        <Input
          errors={!!formik.errors.unityAmount}
          helperText={formik.errors.unityAmount}
          keyboardType="decimal-pad"
          placeholder="Valor do litro"
          onChangeText={(text) =>
            formik.setFieldValue("unityAmount", moeda(text))
          }
          value={formik.values.unityAmount}
        />
        {formik.errors.unityAmount && (
          <Text color="red.600">{formik.errors.unityAmount}</Text>
        )}
      </VStack>

      <VStack space={2}>
        <Text color={text}>Valor pago</Text>
        <Input
          errors={!!formik.errors.amount}
          helperText={formik.errors.amount}
          keyboardType="decimal-pad"
          placeholder="Valor pago"
          onChangeText={(text) => formik.setFieldValue("amount", moeda(text))}
          value={formik.values.amount}
        />
        {formik.errors.amount && (
          <Text color="red.600">{formik.errors.amount}</Text>
        )}
      </VStack>
      <VStack>
        <Text color={text}>Tipo do combustivel</Text>
        <Picker
          selectedValue={formik.values.type ?? "Gasolina comum"}
          onValueChange={(itemValue, itemIndex) =>
            formik.setFieldValue("type", itemValue)
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
          <Picker.Item label="Gasolina comum" value="Gasolina comum" />
          <Picker.Item label="Gasolina aditivada" value="Gasolina aditivada" />
          <Picker.Item label="Etanol" value="Etanol" />
          <Picker.Item label="Etanol aditivada" value="Etanol aditivada" />
          <Picker.Item label="Carga elétrica" value="Carga elétrica" />
          <Picker.Item label="GNV" value="GNV" />
          <Picker.Item label="Dísel" value="Dísel" />
          <Picker.Item label="Dísel-S10" value="Dísel-S10" />
          <Picker.Item label="Dísel aditivado" value="Dísel aditivado" />
        </Picker>
        {formik.errors.type && (
          <Text color={"red.600"}>{formik.errors.type}</Text>
        )}
      </VStack>

      <VStack space={2}>
        <Text color={text}>Data de vencimento</Text>
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
