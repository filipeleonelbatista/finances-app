import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ToastAndroid } from "react-native";

export function useOpenAi() {
  const [apiKey, setApiKey] = useState('')
  const [openai, setOpenai] = useState(null)

  const handleSaveApiKey = async (text) => {
    try {
      const configuration = new Configuration({
        apiKey: text, //process.env.OPENAI_API_KEY,
      });

      const openai = new OpenAIApi(configuration);

      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Olá mundo" }],
        temperature: 1,
        max_tokens: 2048, //256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      await AsyncStorage.setItem('@ApiKey', text);
      setOpenai(openai)
      setApiKey(text)

      ToastAndroid.show('Chave de Api Adicionada', ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Houve um erro", openaiErrorHandler(error))
    }
  }

  const checkIfApiKeyExists = async () => {
    const value = await AsyncStorage.getItem('@ApiKey');
    if (value !== null) {
      setApiKey(value)
      return true;
    }
    return false;
  }

  useEffect(() => {
    checkIfApiKeyExists();
  }, [])

  const openaiErrorHandler = (error) => {
    // https://platform.openai.com/docs/guides/error-codes/api-errors
    console.log("openaiErrorHandler", error)
    // console.log("openaiErrorHandler", error.response.data)
    // console.log("openaiErrorHandler", Object.keys(error.response.data.error))

    switch (error.response.status) {
      case 400:
        return "Não foi possivel fazer a pesquisa."
      case 401:
        return "Não foi possivel fazer a pesquisa."
      case 429:
        return "Não foi possivel fazer a pesquisa."
      case 500:
        return "Não foi possivel fazer a pesquisa."
      case 503:
        return "Não foi possivel fazer a pesquisa."

      default:
        return "Não foi possivel fazer a pesquisa."
    }
  }

  return {
    apiKey,
    checkIfApiKeyExists,
    handleSaveApiKey,
    openaiErrorHandler,
    openai
  };
}