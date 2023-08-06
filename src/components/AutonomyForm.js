import React, { useMemo } from "react";

import { useFormik } from "formik";
import {
  Button,
  Input,
  ScrollView,
  Text,
  VStack,
  useColorModeValue,
  useTheme,
} from "native-base";
import * as Yup from "yup";
import { useRuns } from "../hooks/useRuns";

export default function AutonomyForm({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { setAutonomyValue, autonomy } = useRuns();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      autonomy: Yup.string().required("O campo Autonomia é obrigatório"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      autonomy: String(autonomy),
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    setAutonomyValue(Number(formValues.autonomy));
    onClose();
  }

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Autonomia
      </Text>
      <Text color={text} mb={4}>
        Adicione a autonomia do veículo para estimar o uso do combustível.
      </Text>

      <VStack space={2}>
        <Text color={text}>Valor do Km/L</Text>
        <Input
          errors={!!formik.errors.autonomy}
          helperText={formik.errors.autonomy}
          keyboardType="decimal-pad"
          placeholder="Valor do Km/L"
          onChangeText={(text) => formik.setFieldValue("autonomy", text)}
          value={formik.values.autonomy}
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
