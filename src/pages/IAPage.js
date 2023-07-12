import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, HStack, IconButton, Input, KeyboardAvoidingView, Pressable, Text, useColorModeValue, useTheme, VStack } from 'native-base';
import React from 'react';
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function IAPage() {
    const theme = useTheme();
    const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
    const bgCard = useColorModeValue(theme.colors.gray[200], theme.colors.gray[800]);
    const headerText = useColorModeValue('white', theme.colors.gray[800]);
    const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);

    const navigation = useNavigation();

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
                <ScrollView flex={1} w={'100%'} h={'100%'}>
                    {/* 
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
                    */}

                    <VStack alignItems={"center"} justifyContent="flex-end" w={'100%'}>
                        <HStack space={4} my={2} w={'100%'} px={4} justifyContent={'flex-end'}>
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
                                    De acordo com os gastos que tive esse mês, quais gastos poderiam ser melhorados?
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

                        <HStack space={4} my={2} w={'100%'} px={4} justifyContent={'flex-start'}>
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
                            <Box
                                w={'75%'}
                                px={4}
                                py={2}
                                bgColor={bgCard}
                                shadow={2}
                                borderRadius={4}
                                position={'relative'}
                            >
                                {/* <Text color={text}>
                                    Ola
                                </Text> */}
                                <Text color={text}>
                                    Análisando os dados que você tem cadastrado segue umas dicas: {'\n'}{'\n'}
                                    1. Verifique as descrições e categorias de cada transação para identificar os principais itens em que você gastou dinheiro.
                                    Por exemplo, você pode observar que gastou muito em "Cartão" ou "Vestuário".{'\n'}
                                    2. Cartão Lisandra 1/2 e Cartão Filipe: Avalie a natureza dessas despesas e considere se há maneiras de reduzir os gastos com cartão de crédito. Isso pode envolver limitar os gastos discricionários ou revisar seu plano de pagamento para evitar juros elevados.{'\n'}
                                    3. Luz: Verifique se há oportunidades de economizar energia em sua moradia, como desligar luzes desnecessárias, trocar lâmpadas por versões mais eficientes ou adotar hábitos que levem a um consumo menor de energia.{'\n'}
                                    4. Internet: Considere comparar preços de provedores de serviços de internet para garantir que você esteja obtendo a melhor oferta. Você também pode entrar em contato com seu provedor atual para avaliar se há opções de planos mais econômicos.{'\n'}
                                    5. Celulares 3/10: Avalie se você realmente precisa de tantos celulares e considere se é possível reduzir o número de linhas ou procurar planos mais econômicos.{'\n'}
                                    6. Avon: Verifique se há itens que você não precisa comprar com frequência ou se é possível encontrar alternativas mais acessíveis.{'\n'}
                                    7. Pompéia 2/5, 3/4, 2/5, 4/5 e 5/5: Considere avaliar seu orçamento para roupas e ver se é possível reduzir os gastos com vestuário.{'\n'}
                                    8. Dentista Lisandra: Verifique se o valor gasto no dentista é justificado ou se você pode procurar alternativas mais acessíveis.{'\n'}{'\n'}
                                    Essas são apenas sugestões com base nos dados fornecidos. Lembre-se de que é importante analisar cuidadosamente suas despesas pessoais e identificar áreas específicas em que você pode reduzir ou otimizar gastos com base em suas prioridades e metas financeiras.
                                </Text>
                            </Box>
                        </HStack>
                    </VStack>

                    <Box w={'100%'} h={82} />
                </ScrollView>
                <VStack bg={bg} shadow={4} space={2} position="absolute" bottom={0} w={'100%'} px={4} py={4}>
                    <HStack space={2}>
                        <Input
                            flex={1}
                            placeholder="Digite sua pergunta aqui..."
                        />
                        <IconButton
                            w={12}
                            bg={theme.colors.purple[600]}
                            onPress={() => { }}
                            icon={<Octicons name="paper-airplane" size={20} color={headerText} />}
                        />
                    </HStack>
                    {/* <Text color="red.500">
                        <Feather name="alert-circle" size={14} /> Quando ouver um erro.
                    </Text> */}
                </VStack>
            </VStack >
        </KeyboardAvoidingView >
    );
}