import React, { useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
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

export default function EditListForm({ onClose }) {
  const theme = useTheme();
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const navigation = useNavigation();

  const { updateTransaction, selectedList } = useLists();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Nome da lista é obrigatório"),
      location: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      description: selectedList.description ?? "",
      location: selectedList.location ?? "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  async function handleSubmitForm(formValues) {
    try {
      const createdList = {
        ...selectedList,
        description: formValues.description,
        location: formValues.location,
      };

      await updateTransaction(createdList);

      onClose();
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  return (
    <ScrollView w={"100%"} px={4}>
      <Text bold fontSize={24} color={text}>
        Editar informações da Lista
      </Text>
      <Text color={text} mb={4}>
        Edite os dados da sua lista.
      </Text>

      <VStack space={2}>
        <Text color={text}>Nome da lista</Text>
        <Input
          errors={!!formik.errors.description}
          helperText={formik.errors.description}
          placeholder="Nome da lista"
          onChangeText={(text) => formik.setFieldValue("description", text)}
          value={formik.values.description}
        />
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
        <Text color={text} fontSize={12}>
          Esse local será usado para criar os itens da sua lista. Ao adicionar
          um item na lista você poderá mudar isso se preferir.
        </Text>
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
