import {
  Actionsheet,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text,
  useColorModeValue,
  useDisclose,
  useTheme,
  VStack,
} from "native-base";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Feather } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { differenceInCalendarDays } from "date-fns";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import EditGoalForm from "../components/EditGoalForm";
import EmptyMessage from "../components/EmptyMessage";
import Header from "../components/Header";
import { useGoals } from "../hooks/useGoals";
import { usePages } from "../hooks/usePages";
import { usePayments } from "../hooks/usePayments";
import { useSettings } from "../hooks/useSettings";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";
import AIComponent from "../components/AIComponent";
import { useRuns } from "../hooks/useRuns";

export default function Reports() {
  const theme = useTheme();

  const bg = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[900]
  );
  const bgCard = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[800]
  );
  const bgCardButton = useColorModeValue(
    theme.colors.warmGray[100],
    theme.colors.gray[700]
  );

  const bgCardPressed = useColorModeValue(
    theme.colors.warmGray[100],
    theme.colors.gray[700]
  );

  const headerText = useColorModeValue("white", theme.colors.gray[800]);
  const text = useColorModeValue(
    theme.colors.gray[600],
    theme.colors.gray[200]
  );

  const { setSelectedSheet } = usePages();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedSheet("Relatórios");
    }
  }, [isFocused]);

  const isKeyboardOpen = useIsKeyboardOpen();

  const { isOpen, onOpen, onClose } = useDisclose();

  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();

  const { Incomings, Expenses, filteredList, setStartDate, setEndDate } =
    usePayments();

  const {
    GoalsList: goalsList,
    selectedTransaction,
    setSelectedTransaction,
  } = useGoals();

  const { FuelList } = useRuns();

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  };

  const [selectedRunsFilter, setSelectedRunsFilter] = useState("litro");

  const runsChartData = useMemo(() => {
    const currentFuelList = FuelList;

    const last8Elements = currentFuelList
      .sort((a, b) => a.date - b.date)
      .slice(-8);

    const labels = last8Elements.map((item) => {
      const dateObj = new Date(item.date);
      const dia = dateObj.getUTCDate().toString().padStart(2, "0");
      const mes = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
      return `${dia}/${mes}`;
    });

    const data = last8Elements.map((item) =>
      selectedRunsFilter === "litro" ? item.unityAmount : item.amount
    );

    return { labels, data };
  }, [FuelList, selectedRunsFilter]);

  const expensesByCatData = useMemo(() => {
    const getSum = (cat) => {
      const filteredCategoryArray = filteredList.filter(
        (item) => item.category === cat
      );

      let totalSelectedCat = 0.0;

      for (const item of filteredCategoryArray) {
        totalSelectedCat = item.amount + totalSelectedCat;
      }

      return totalSelectedCat;
    };

    const data = [
      {
        name: "Cartão",
        population: getSum("Cartão"),
        color: "#2D0D45",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Moradia",
        population: getSum("Moradia"),
        color: "#391056",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Vestuário",
        population: getSum("Vestuário"),
        color: "#4F1778",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Streaming",
        population: getSum("Streaming"),
        color: "#661D9A",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Estudos",
        population: getSum("Estudos"),
        color: "#7D24BC",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Beleza",
        population: getSum("Beleza"),
        color: "#9231D8",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Emergência",
        population: getSum("Emergência"),
        color: "#9C44DC",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Outros",
        population: getSum("Outros"),
        color: "#AA5DE0",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Mercado",
        population: getSum("Mercado"),
        color: "#B16BE3",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "TV/Internet/Telefone",
        population: getSum("TV/Internet/Telefone"),
        color: "#C693EA",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Transporte",
        population: getSum("Transporte"),
        color: "#D4AEF0",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Saúde",
        population: getSum("Saúde"),
        color: "#DBBCF2",
        legendFontColor: text,
        legendFontSize: 14,
      },
      {
        name: "Bares e Restaurantes",
        population: getSum("Bares e Restaurantes"),
        color: "#DBBCF2",
        legendFontColor: text,
        legendFontSize: 14,
      },
    ];

    const filteredData = data.filter((item) => item.population > 0);

    const sortedData = filteredData.sort((a, b) => {
      if (a.population < b.population) {
        return 1;
      } else if (a.population > b.population) {
        return -1;
      } else {
        return 0;
      }
    });

    return sortedData;
  }, [filteredList]);

  const onChangeStartDate = (_, selectedDate) => {
    setStartDate(dayjs(selectedDate).format("DD/MM/YYYY"));
  };

  return (
    <VStack flex={1} bg={bg}>
      <ScrollView flex={1} w={"100%"} h={"100%"}>
        <Header
          title="Relatório"
          isRightIconComponent={
            <IconButton
              size={10}
              borderRadius="full"
              icon={<Feather name="settings" size={20} color={headerText} />}
              onPress={() => navigation.navigate("Configuracoes")}
              _pressed={{
                bgColor: theme.colors.purple[900],
              }}
            />
          }
        />

        <VStack space={4} px={4}>
          <VStack
            borderRadius={4}
            bg={bgCard}
            py={2}
            px={4}
            mt={-50}
            shadow={2}
          >
            {filteredList.length === 0 ? (
              <VStack alignItems="center" justifyContent="center">
                <Text color={text} fontSize={20}>
                  Sem dados para analisar
                </Text>
                <Text color={text} textAlign="center">
                  Adicione e atualize os dados em finanças para ver o relatório
                  aqui.
                </Text>
              </VStack>
            ) : (
              <VStack space={2}>
                <Text bold color={text} fontSize={20}>
                  Saúde das finanças
                </Text>

                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <HStack alignItems={"center"} space={2}>
                    <Feather
                      name="arrow-up-circle"
                      size={36}
                      color={"#12a454"}
                    />
                    <VStack alignItems={"flex-start"}>
                      <Text color={text} fontSize={18}>
                        Ganhos
                      </Text>
                      <Text color={text} fontSize={18} bold>
                        {formatCurrency(Incomings)}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack alignItems={"center"} space={2}>
                    <VStack alignItems={"flex-end"}>
                      <Text color={text} fontSize={18}>
                        Despesas
                      </Text>
                      <Text color={text} fontSize={18} bold>
                        {formatCurrency(Expenses)}
                      </Text>
                    </VStack>
                    <Feather
                      name="arrow-down-circle"
                      size={36}
                      color={"#e83e5a"}
                    />
                  </HStack>
                </HStack>
                <Progress.Bar
                  progress={
                    (Incomings * 100) / (Incomings + Expenses) / 100 >= 1
                      ? 1
                      : (Incomings * 100) / (Incomings + Expenses) / 100
                  }
                  width={width * 0.81}
                  height={14}
                  borderRadius={16}
                  color={theme.colors.green[600]}
                  unfilledColor={theme.colors.red[600]}
                  borderWidth={0}
                />
              </VStack>
            )}

            {expensesByCatData.length > 0 && (
              <VStack space={2} position="relative" mt={2}>
                <Text color={text} fontSize={18} bold>
                  Gastos por categoria
                </Text>
                <PieChart
                  width={width * 0.81}
                  height={width * 0.6}
                  data={expensesByCatData}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                />
              </VStack>
            )}

            {FuelList.length > 0 && runsChartData && (
              <VStack mt={2} space={2} alignItems="center">
                <Text color={text} fontSize={18} w={"100%"}>
                  Abastecimentos
                </Text>
                <HStack
                  mb={4}
                  shadow={2}
                  borderRadius={4}
                  bg={bgCardButton}
                  w={"100%"}
                >
                  <Pressable
                    bgColor={bgCardButton}
                    p={2}
                    flex={1}
                    borderTopLeftRadius={4}
                    borderBottomLeftRadius={4}
                    alignItems="center"
                    justifyContent="center"
                    borderBottomColor={
                      selectedRunsFilter === "litro"
                        ? "purple.500"
                        : bgCardButton
                    }
                    borderBottomWidth={2}
                    onPress={() => setSelectedRunsFilter("litro")}
                    _pressed={{
                      bgColor: bgCard,
                    }}
                  >
                    <Text
                      fontSize={14}
                      fontWeight={500}
                      color={
                        selectedRunsFilter === "litro" ? "purple.500" : text
                      }
                    >
                      Por Litro
                    </Text>
                  </Pressable>

                  <Pressable
                    bgColor={bgCardButton}
                    p={2}
                    flex={1}
                    borderTopLeftRadius={4}
                    borderBottomLeftRadius={4}
                    alignItems="center"
                    justifyContent="center"
                    borderBottomColor={
                      selectedRunsFilter === "pago"
                        ? "purple.500"
                        : bgCardButton
                    }
                    borderBottomWidth={2}
                    onPress={() => setSelectedRunsFilter("pago")}
                    _pressed={{
                      bgColor: bgCard,
                    }}
                  >
                    <Text
                      fontSize={14}
                      fontWeight={500}
                      color={
                        selectedRunsFilter === "pago" ? "purple.500" : text
                      }
                    >
                      Pago
                    </Text>
                  </Pressable>
                </HStack>
                <HStack ml={-5}>
                  <LineChart
                    data={{
                      labels: runsChartData.labels,
                      datasets: [
                        {
                          data: runsChartData.data,
                          color: () => theme.colors.purple[800],
                          strokeWidth: 1.5,
                        },
                      ],
                    }}
                    width={width * 0.84}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: bgCard,
                      backgroundGradientFromOpacity: 1,
                      backgroundGradientTo: bgCard,
                      backgroundGradientToOpacity: 1,
                      color: () => text,
                      barPercentage: 0.5,
                      useShadowColorFromDataset: true,
                      propsForVerticalLabels: {
                        fontSize: 10,
                      },
                      propsForDots: {
                        onPress: (event) => console.log("event", event),
                      },
                    }}
                  />
                </HStack>
              </VStack>
            )}
          </VStack>

          <VStack space={2}>
            <Text bold fontSize={20} color={text}>
              Minhas metas
            </Text>
            <Text fontSize={14} color={text}>
              Adicione e atualize suas metas financeiras.
            </Text>
          </VStack>

          {goalsList.length === 0 && <EmptyMessage />}

          {goalsList.map((goal) => (
            <Pressable
              key={goal.id}
              onPress={() => {
                setSelectedTransaction(goal);
                onOpen();
              }}
              bg={bgCard}
              _pressed={{
                bgColor: bgCardPressed
              }}
            >
              <VStack
                alignItems={"center"}
                bg={bgCard}
                shadow={2}
                borderRadius={2}
                px={4}
                py={2}
              >
                <HStack
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  space={2}
                  w={"100%"}
                >
                  <Text color={text} fontSize={18}>
                    {goal.description}
                  </Text>
                  <Text color={text} fontSize={12}>
                    {"Prazo: "}
                    {new Date(goal.date).toLocaleDateString("pt-BR")}
                  </Text>
                </HStack>
                <HStack
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  space={2}
                  w={"100%"}
                  mb={1}
                >
                  <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Text color={text} fontSize={14} textAlign={"right"}>
                      {goal.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      })}
                      {" /"}
                    </Text>
                    <Text color={text} fontSize={16} bold textAlign={"right"}>
                      {goal.currentAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      })}
                    </Text>
                  </HStack>
                  {differenceInCalendarDays(goal.date, Date.now()) <= 30 && (
                    <Text color={text} fontSize={16} bold textAlign={"left"}>
                      Restam {differenceInCalendarDays(goal.date, Date.now())}{" "}
                      dias
                    </Text>
                  )}
                </HStack>
                <Progress.Bar
                  progress={
                    (goal.currentAmount * 100) / goal.amount / 100 >= 1
                      ? 1
                      : (goal.currentAmount * 100) / goal.amount / 100
                  }
                  width={width * 0.85}
                  height={14}
                  borderRadius={16}
                  color={
                    (goal.currentAmount * 100) / goal.amount / 100 >= 1
                      ? theme.colors.purple[200]
                      : theme.colors.purple[600]
                  }
                  unfilledColor={
                    (goal.currentAmount * 100) / goal.amount / 100 >= 1
                      ? theme.colors.purple[200] + "66"
                      : theme.colors.purple[600] + "66"
                  }
                  borderWidth={0}
                />
              </VStack>
            </Pressable>
          ))}
        </VStack>
        <Box h={4} w={"100%"} />
      </ScrollView>

      <AIComponent />

      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        h={height * (isKeyboardOpen ? 0.9 : 1.09)}
      >
        <Actionsheet.Content pb={isKeyboardOpen ? 24 : 0}>
          <EditGoalForm
            onClose={onClose}
            selectedTransaction={selectedTransaction}
          />
          <Box h={16} w={"100%"} />
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
