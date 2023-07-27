import { Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Actionsheet, Box, Button, HStack, IconButton, Input, KeyboardAvoidingView, Link, Pressable, Spinner, Text, useColorModeValue, useTheme, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import LoadingDots from 'react-native-loading-dots';
import Header from '../components/Header';
import { useIsKeyboardOpen } from '../hooks/useIsKeyboardOpen';
import { useMarket } from '../hooks/useMarket';
import { useOpenAi } from '../hooks/useOpenAi';
import { usePayments } from '../hooks/usePayments';
import { useRuns } from '../hooks/useRuns';
import { Configuration, OpenAIApi } from 'openai';

export default function IAPage() {
    const theme = useTheme();
    const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
    const bgCard = useColorModeValue(theme.colors.gray[200], theme.colors.gray[800]);
    const headerText = useColorModeValue('white', theme.colors.gray[800]);
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const navigation = useNavigation();

    const scrollViewRef = useRef();

    const { filteredList } = usePayments();
    const { FuelList, autonomy } = useRuns();
    const { filteredList: MarketList } = useMarket();

    const { checkIfApiKeyExists, openaiErrorHandler, handleSaveApiKey, apiKey } = useOpenAi();

    const configuration = new Configuration({
        apiKey: apiKey, //process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const isFocused = useIsFocused();
    const [inputTextApiKey, setInputTextApiKey] = useState('');

    const isKeyboardOpen = useIsKeyboardOpen();
    const { height } = useWindowDimensions();

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const financesList = useMemo(() => {
        const headers = "valor;vencimento;data de vencimento;data de pagamento;descrição;categorias;pago"
        const data = filteredList.map(item =>
            [
                item.amount,
                new Date(item.date).toLocaleDateString('pt-BR'),
                new Date(item.paymentDate).toLocaleDateString('pt-BR'),
                item.description,
                item.category,
                item.paymentStatus ? "Pago" : "Não pago"
            ]
        ).join("\n").replaceAll(",", ";")

        return headers + "\n" + data;
    }, [filteredList])

    const fuelCostsList = useMemo(() => {
        const headers = "valor pago;valor do litro do combustível;data de abastecimento;local do abastecimento;tipo de combustivel;Kilometragem do veiculo no abastecimento"
        const data = FuelList.map(item =>
            [
                item.amount,
                item.unityAmount,
                new Date(item.date).toLocaleDateString('pt-BR'),
                item.location,
                item.type,
                item.currentDistance,
            ]
        ).join("\n").replaceAll(",", ";")

        return headers + "\n" + data + "\n\n" + "Autonomia do veículo: " + autonomy ?? 0;
    }, [FuelList])

    const marketCostsList = useMemo(() => {
        const headers = "valor unitário;quantidade;produto;categoria"
        const data = MarketList.map(item =>
            [
                item.amount,
                item.quantity,
                item.description,
                item.category,
            ]
        ).join("\n").replaceAll(",", ";")

        return headers + "\n" + data;
    }, [MarketList])

    const handleAskForFinancialTips = async () => {
        try {
            setInputText('De acordo com os gastos que tive esse mês, quais gastos poderiam ser melhorados?')
            setIsLoading(true)

            const userMessage = `
                Use esses dados para analisar e depois me responda:

                ${financesList}

                De acordo com os gastos que tive esse mês, quais gastos poderiam ser melhorados?

                Limite-se a criar um texto em no máximo 1000 caracteres.
                `;

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage.replaceAll("                ", "") }],
                temperature: 1,
                max_tokens: 2048, //256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            setData([
                ...data,
                { type: 'user', text: 'De acordo com os gastos que tive esse mês, quais gastos poderiam ser melhorados?' },
                { type: 'assistant', text: result.data.choices[0].message.content }
            ])

            setInputText('')
        } catch (error) {
            console.log("Erro: ", error.response)
            setError(openaiErrorHandler(error))
        } finally {
            setIsLoading(false)
        }
    }

    const handleAskForFuelCostsTips = async () => {
        try {
            setInputText('De acordo com os abastecimentos que tive esse mês, o que posso melhorar para evitar gastos?')
            setIsLoading(true)

            const userMessage = `
                Use esses dados para analisar e depois me responda:

                ${fuelCostsList}

                De acordo com os abastecimentos que tive esse mês, o que posso melhorar para evitar gastos?

                Limite-se a criar um texto em no máximo 1000 caracteres.
                `;

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                temperature: 1,
                max_tokens: 2048, //256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            setData([
                ...data,
                { type: 'user', text: 'De acordo com os abastecimentos que tive esse mês, o que posso melhorar para evitar gastos?' },
                { type: 'assistant', text: result.data.choices[0].message.content }
            ])

            setInputText('')
        } catch (error) {
            console.log("Erro: ", error)
            setError(openaiErrorHandler(error))
        } finally {
            setIsLoading(false)
        }
    }

    const handleAskForMarketCostsTips = async () => {
        try {
            setInputText('De acordo com as compras de mercado que tive esse mês, quais gastos poderiam ser melhorados?')
            setIsLoading(true)

            const userMessage = `
                Use esses dados para analisar e depois me responda:

                ${marketCostsList}

                De acordo com as compras de mercado que tive esse mês, quais gastos poderiam ser melhorados?

                Limite-se a criar um texto em no máximo 1000 caracteres.
                `;

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                temperature: 1,
                max_tokens: 2048, //256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            setData([
                ...data,
                { type: 'user', text: 'De acordo com as compras de mercado que tive esse mês, quais gastos poderiam ser melhorados?' },
                { type: 'assistant', text: result.data.choices[0].message.content }
            ])

            setInputText('')
        } catch (error) {
            console.log("Erro: ", error)
            setError(openaiErrorHandler(error))
        } finally {
            setIsLoading(false)
        }
    }

    const handleAskToAi = async () => {
        try {
            setIsLoading(true)

            const newDataForConversation = data.map(item => ({ role: item.type, content: item.text }))

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [...newDataForConversation, { role: "user", content: inputText }],
                temperature: 1,
                max_tokens: 2048, //256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            setData([
                ...data,
                { type: 'user', text: inputText },
                { type: 'assistant', text: result.data.choices[0].message.content }
            ])

            setInputText('')
        } catch (error) {
            setError(openaiErrorHandler(error))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isFocused) {
            async function executeAsync() {
                const existsApi = await checkIfApiKeyExists()
                if (existsApi) {
                    setOpen(false)
                } else {
                    setOpen(true)
                }
            }
            executeAsync();
        }
    }, [isFocused, checkIfApiKeyExists])

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        return () => backHandler.remove();
    })

    return (
        <KeyboardAvoidingView flex={1}>

            <VStack flex={1} bg={bg} position="relative">
                {
                    openai === null && (
                        <VStack
                            flex={1}
                            bgColor={"#000000AA"}
                            position={'absolute'}
                            zIndex={1000}
                            width={'100%'}
                            alignItems={"center"}
                            justifyContent={"center"}
                            h={height + 10}
                        >
                            <Spinner color={bg} size={60} />
                        </VStack>
                    )
                }
                <Header
                    isShort
                    isLeft
                    title="Conversa"
                    iconComponent={
                        <IconButton
                            size={10}
                            borderRadius='full'
                            icon={<Feather name="arrow-left" size={20} color={headerText} />}
                            onPress={() => navigation.goBack()}
                            _pressed={{
                                bgColor: theme.colors.purple[900]
                            }}
                        />
                    }
                />
                <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled={true}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        scrollViewRef.current?.scrollTo({ y: contentHeight });
                    }}
                    flex={1}
                    w={'100%'}
                    h={'100%'}
                >

                    {
                        data.length === 0 && !isLoading ? (
                            <VStack w={'100%'} space={4} px={4} alignItems={"center"} justifyContent={"center"} flex={1} mt={10}>
                                <Text color={text} fontSize={18} lineHeight={24} textAlign="center" maxW="80%" my={6}>
                                    Converse com um assistente baseado em Inteligência Artificial.
                                </Text>

                                <Pressable
                                    bgColor={bgCard}
                                    shadow={2}
                                    borderRadius={4}
                                    w={'90%'}
                                    px={4}
                                    py={2}
                                    onPress={handleAskForFinancialTips}
                                    _pressed={{
                                        bgColor: 'gray.300'
                                    }}
                                >
                                    <HStack
                                        position={'relative'}
                                        alignItems="center"
                                        space={4}
                                    >
                                        <Feather name={"dollar-sign"} size={20} color={text} />
                                        <Text color={text} maxW={"90%"}>
                                            Analise meus gastos e sugira pontos onde eu posso melhorar.
                                        </Text>
                                    </HStack>
                                </Pressable>

                                <Pressable
                                    bgColor={bgCard}
                                    shadow={2}
                                    borderRadius={4}
                                    w={'90%'}
                                    px={4}
                                    py={2}
                                    onPress={handleAskForFuelCostsTips}
                                    _pressed={{
                                        bgColor: 'gray.300'
                                    }}
                                >
                                    <HStack
                                        position={'relative'}
                                        alignItems="center"
                                        space={4}
                                    >
                                        <Feather name={"droplet"} size={20} color={text} />
                                        <Text color={text} maxW={"90%"}>
                                            Analise como posso melhorar meus gastos com combustível.
                                        </Text>
                                    </HStack>
                                </Pressable>

                                <Pressable
                                    bgColor={bgCard}
                                    shadow={2}
                                    borderRadius={4}
                                    w={'90%'}
                                    px={4}
                                    py={2}
                                    onPress={handleAskForMarketCostsTips}
                                    _pressed={{
                                        bgColor: 'gray.300'
                                    }}
                                >
                                    <HStack
                                        position={'relative'}
                                        alignItems="center"
                                        space={4}
                                    >
                                        <Feather name={"shopping-cart"} size={20} color={text} />
                                        <Text color={text} maxW={"90%"}>
                                            Analise meus gastos com mercado e sugira pontos onde eu posso melhorar a alimentação.
                                        </Text>
                                    </HStack>
                                </Pressable>

                                <Text color={text} fontSize={14} lineHeight={16} textAlign="center" maxW="80%" mt={6}>
                                    ou digite seu texto para iniciar a conversa.
                                </Text>
                            </VStack>
                        ) :
                            (

                                <VStack alignItems={"center"} justifyContent="center" w={'100%'} space={4}>
                                    {data.map((mensagem, index) => (
                                        <HStack
                                            key={index}
                                            space={4}
                                            my={2}
                                            w={'100%'}
                                            px={4}
                                            flexDirection={mensagem.type === 'user' ? 'row' : 'row-reverse'}
                                            justifyContent={"flex-end"}
                                        >
                                            <Box
                                                w={'75%'}
                                                px={4}
                                                py={2}
                                                bgColor={mensagem.type === 'user' ? "purple.500" : bgCard}
                                                shadow={2}
                                                borderRadius={4}
                                                position={'relative'}
                                            >
                                                <Text color={mensagem.type === 'user' ? "white" : text}>
                                                    {mensagem.text}
                                                </Text>
                                            </Box>
                                            <Box
                                                w={10}
                                                h={10}
                                                borderRadius={"full"}
                                                alignItems="center"
                                                justifyContent="center"
                                                shadow={2}
                                                bgColor={theme.colors.purple[300]}
                                            >
                                                <MaterialCommunityIcons name={mensagem.type === 'user' ? "account" : "robot-outline"} size={20} color={headerText} />
                                            </Box>
                                        </HStack>
                                    ))}
                                    {
                                        isLoading && (
                                            <>
                                                <HStack
                                                    space={4}
                                                    my={2}
                                                    w={'100%'}
                                                    px={4}
                                                    flexDirection={'row'}
                                                    justifyContent={"flex-end"}
                                                >
                                                    <Box
                                                        w={'75%'}
                                                        px={4}
                                                        py={2}
                                                        bgColor={"purple.500"}
                                                        shadow={2}
                                                        borderRadius={4}
                                                        position={'relative'}
                                                    >
                                                        <Text color={"white"}>
                                                            {inputText}
                                                        </Text>
                                                    </Box>
                                                    <Box
                                                        w={10}
                                                        h={10}
                                                        borderRadius={"full"}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        shadow={2}
                                                        bgColor={theme.colors.purple[300]}
                                                    >
                                                        <MaterialCommunityIcons name={"account"} size={20} color={headerText} />
                                                    </Box>
                                                </HStack>

                                                <HStack
                                                    space={4}
                                                    my={2}
                                                    w={'100%'}
                                                    px={4}
                                                    flexDirection={'row-reverse'}
                                                    justifyContent={"flex-end"}
                                                >
                                                    <Box
                                                        px={4}
                                                        py={2}
                                                        bgColor={bgCard}
                                                        shadow={2}
                                                        borderRadius={4}
                                                        position={'relative'}
                                                    >
                                                        <Text color={"white"}>
                                                            <LoadingDots dots={3} colors={[text, text, text]} size={8} bounceHeight={3} />
                                                        </Text>
                                                    </Box>
                                                    <Box
                                                        w={10}
                                                        h={10}
                                                        borderRadius={"full"}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        shadow={2}
                                                        bgColor={theme.colors.purple[300]}
                                                    >
                                                        <MaterialCommunityIcons name={"robot-outline"} size={20} color={headerText} />
                                                    </Box>
                                                </HStack>
                                            </>
                                        )
                                    }
                                </VStack>
                            )
                    }




                    <Box w={'100%'} h={92} />
                </ScrollView>
                <VStack bg={bg} shadow={4} space={1} position="absolute" bottom={0} w={'100%'} px={4} py={4}>

                    {
                        isLoading && (
                            <HStack space={2} pl={2}>
                                <LoadingDots dots={3} colors={[text, text, text]} size={8} bounceHeight={3} />
                                <Text color={text} fontSize={12}>Estou digitando...</Text>
                            </HStack>
                        )
                    }
                    <HStack space={2}>
                        <Input
                            flex={1}
                            placeholder="Digite sua pergunta aqui..."
                            onChangeText={(text) => {
                                setInputText(text)
                            }}
                            value={inputText}
                        />
                        <IconButton
                            w={12}
                            bg={theme.colors.purple[600]}
                            onPress={() => {
                                if (inputText.length === 0) {
                                    setError("Digite uma mensagem para continuar")
                                } else {
                                    setError(null)
                                    handleAskToAi()
                                }
                            }}
                            icon={<Octicons name="paper-airplane" size={20} color={headerText} />}
                            _pressed={{
                                bgColor: 'purple.900'
                            }}
                        />
                    </HStack>
                    {
                        error && (
                            <Text color="red.500" >
                                <Feather name="alert-circle" size={14} /> {error}
                            </Text>
                        )
                    }
                </VStack>
            </VStack >

            <Actionsheet isOpen={open} onClose={() => setOpen(false)} size="full" h={height * (isKeyboardOpen ? 0.9 : 1.09)}>
                <Actionsheet.Content pb={isKeyboardOpen ? 24 : 0}>
                    <VStack space={4} p={4}>
                        <Text color={text} textAlign="center" bold fontSize={22}>
                            Chave de api necessária
                        </Text>
                        <Text color={text} textAlign="center">
                            Como é um recurso limitado e a idéia do aplicativo é ser gratuito,
                            é necessario entrar no site da OpenAI e solicitar a Chave de API e
                            que você tenha créditos de uso lá para poder usar neste app.
                        </Text>
                        <VStack space={2}>
                            <Text color={text}>
                                Cole sua chave de api aqui.
                            </Text>
                            <Input
                                placeholder="Chave de api"
                                onChangeText={(text) => setInputTextApiKey(text)}
                                value={inputTextApiKey}
                            />
                        </VStack>

                        <Link href={"https://platform.openai.com/account/api-keys"} _text={{ color: 'purple.500' }}>
                            Clique aqui para obter uma Chave de API OpenAi
                        </Link>

                        <Button
                            onPress={() => {
                                handleSaveApiKey(inputTextApiKey)
                                setOpen(false)
                            }}
                            colorScheme="purple"
                            _text={{
                                color: "white",
                            }}
                            _pressed={{
                                bgColor: theme.colors.purple[900]
                            }}
                        >
                            Salvar
                        </Button>


                        <Button
                            onPress={() => {
                                setOpen(false)
                                navigation.goBack()
                            }}
                            borderColor="purple.600"
                            variant={"outline"}
                            _text={{
                                color: "purple.600",
                            }}
                            _pressed={{
                                bgColor: theme.colors.purple[900]
                            }}
                        >
                            Voltar
                        </Button>
                    </VStack>
                    <Box h={16} w={'100%'} />
                </Actionsheet.Content>
            </Actionsheet>
        </KeyboardAvoidingView >
    );
}