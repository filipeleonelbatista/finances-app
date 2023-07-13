import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, HStack, IconButton, Input, KeyboardAvoidingView, Pressable, Text, useColorModeValue, useTheme, VStack } from 'native-base';
import React, { useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import LoadingDots from 'react-native-loading-dots';
import { openai } from '../services/openai';

export default function IAPage() {
    const theme = useTheme();
    const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
    const bgCard = useColorModeValue(theme.colors.gray[200], theme.colors.gray[800]);
    const headerText = useColorModeValue('white', theme.colors.gray[800]);
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const navigation = useNavigation();

    const scrollViewRef = useRef();


    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleAskToAi = async () => {
        try {
            setIsLoading(true)

            const result = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: inputText }],
                temperature: 1,
                max_tokens: 256,
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
            console.log("Erro: ", error)
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

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
                        data.length === 0 ? (
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
                                                <Text color={"white"}>
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
                            onChangeText={(text) => setInputText(text)}
                            value={inputText}
                        />
                        <IconButton
                            w={12}
                            bg={theme.colors.purple[600]}
                            onPress={handleAskToAi}
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
        </KeyboardAvoidingView >
    );
}