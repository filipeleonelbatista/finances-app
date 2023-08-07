import React, { useMemo } from "react";

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
import { useSettings } from "../hooks/useSettings";

export default function EditVeicleForm({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const {
    veicleName,
    veicleBrand,
    veicleYear,
    veicleColor,
    veiclePlate,
    updateVeicle,
  } = useSettings();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string(),
      brand: Yup.string(),
      year: Yup.string(),
      color: Yup.string(),
      plate: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: veicleName,
      brand: veicleBrand,
      year: veicleYear,
      color: veicleColor,
      plate: veiclePlate,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    await updateVeicle(formValues);
    onClose();
  }

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Informações do veículo
      </Text>
      <Text color={text} mb={4}>
        Adicione a Informações sobre o seu veículo para ter mais controles.
      </Text>

      <VStack space={2}>
        <Text color={text}>Modelo</Text>
        <Input
          errors={!!formik.errors.name}
          helperText={formik.errors.name}
          placeholder="Modelo"
          onChangeText={(text) => formik.setFieldValue("name", text)}
          value={formik.values.name}
        />
      </VStack>
      <VStack space={2}>
        <Text color={text}>Marca</Text>
        <Input
          errors={!!formik.errors.brand}
          helperText={formik.errors.brand}
          placeholder="Marca"
          onChangeText={(text) => formik.setFieldValue("brand", text)}
          value={formik.values.brand}
        />
      </VStack>
      <VStack space={2}>
        <Text color={text}>Ano</Text>
        <Input
          errors={!!formik.errors.year}
          helperText={formik.errors.year}
          placeholder="Ano"
          onChangeText={(text) => formik.setFieldValue("year", text)}
          value={formik.values.year}
        />
      </VStack>
      <VStack space={2}>
        <Text color={text}>Cor</Text>
        <Input
          errors={!!formik.errors.color}
          helperText={formik.errors.color}
          placeholder="Cor"
          onChangeText={(text) => formik.setFieldValue("color", text)}
          value={formik.values.color}
        />
      </VStack>
      <VStack space={2}>
        <Text color={text}>Placa</Text>
        <Input
          errors={!!formik.errors.plate}
          helperText={formik.errors.plate}
          placeholder="Placa"
          onChangeText={(text) => formik.setFieldValue("plate", text)}
          value={formik.values.plate}
        />
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
          bgColor: theme.colors.purple[900],
        }}
      >
        Atualizar
      </Button>
    </ScrollView>
  );
}
