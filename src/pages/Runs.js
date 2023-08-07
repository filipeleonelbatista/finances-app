import React, { useMemo, useState } from "react";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Actionsheet,
  Box,
  Button,
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

import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import AIComponent from "../components/AIComponent";
import AutonomyForm from "../components/AutonomyForm";
import EmptyMessage from "../components/EmptyMessage";
import Header from "../components/Header";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";
import { usePages } from "../hooks/usePages";
import { useRuns } from "../hooks/useRuns";
import { useSettings } from "../hooks/useSettings";
import ErrorSheet from "../components/ErrorSheet";
import EditVeicleForm from "../components/EditVeicleForm";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Runs() {
  const theme = useTheme();
  const bgCardPressed = useColorModeValue(
    theme.colors.warmGray[100],
    theme.colors.gray[700]
  );
  const bg = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[900]
  );
  const bgCard = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[800]
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
      setSelectedSheet("Combustível");
    }
  }, [isFocused]);

  const isKeyboardOpen = useIsKeyboardOpen();

  const { isOpen, onOpen, onClose } = useDisclose();

  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();

  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("DD/MM/YYYY")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("DD/MM/YYYY")
  );

  const { FuelList, deleteTransaction } = useRuns();
  const { veicleAutonomy, isAiEnabled } = useSettings();

  const filteredList = useMemo(() => {
    if (FuelList.length > 0) {
      const filteredByPeriod = FuelList.filter((item) => {
        const itemDate = dayjs(item.date);
        const currentStartDate = dayjs(
          `${startDate.split("/")[2]}-${startDate.split("/")[1]}-${
            startDate.split("/")[0]
          }`
        );
        const currentEndDate = dayjs(
          `${endDate.split("/")[2]}-${endDate.split("/")[1]}-${
            endDate.split("/")[0]
          }`
        );
        return (
          itemDate.isSameOrAfter(currentStartDate) &&
          itemDate.isSameOrBefore(currentEndDate)
        );
      });

      const sortedByDateArray = filteredByPeriod.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);

        if (dateA.isBefore(dateB)) {
          return 1;
        }

        if (dateA.isAfter(dateB)) {
          return -1;
        }

        return 0;
      });

      return sortedByDateArray;
    }
    return [];
  }, [FuelList, startDate, endDate]);

  const listTotal = useMemo(() => {
    let TotalList = 0.0;

    for (const item of filteredList) {
      TotalList = TotalList + item.amount;
    }
    return TotalList;
  }, [filteredList]);

  const currentEstimative = useMemo(() => {
    const result = filteredList[0]
      ? (Number(veicleAutonomy) * Number(filteredList[0]?.amount)) /
          Number(filteredList[0]?.unityAmount) +
        Number(filteredList[0]?.currentDistance)
      : 0;

    return result.toFixed(0);
  }, [filteredList, veicleAutonomy]);

  const onChangeStartDate = (_, selectedDate) => {
    setStartDate(dayjs(selectedDate).format("DD/MM/YYYY"));
  };

  const onChangeEndDate = (_, selectedDate) => {
    setEndDate(dayjs(selectedDate).format("DD/MM/YYYY"));
  };

  const [selectedSheetOpen, setSelectedSheetOpen] = useState(null);

  return (
    <VStack flex={1} bg={bg}>
      <IconButton
        position={"absolute"}
        bottom={isAiEnabled ? 82 : 8}
        left={4}
        bgColor={"purple.600"}
        w={10}
        h={10}
        zIndex={100}
        alignItems={"center"}
        justifyContent={"center"}
        onPress={() => {
          setSelectedSheetOpen("veicle");
          onOpen();
        }}
        borderRadius={"full"}
        shadow={4}
        _pressed={{
          bgColor: theme.colors.purple[900],
        }}
        icon={
          <Ionicons
            name="car-sport-outline"
            size={20}
            color={theme.colors.white}
          />
        }
      />

      <ScrollView flex={1} w={"100%"} h={"100%"}>
        <Header
          title="Corrida"
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

        <ScrollView
          horizontal
          w={"100%"}
          mt={-50}
          h={150}
          ItemSeparatorComponent={() => <Box m={2} />}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{
            height: 130,
            paddingHorizontal: 8,
          }}
        >
          <VStack
            mx={1}
            shadow={2}
            bg={theme.colors.purple[900]}
            minW={180}
            h={110}
            borderRadius={4}
            p={4}
          >
            <HStack justifyContent="space-between">
              <Text color={"white"} fontSize={18}>
                Km Estimado
              </Text>
              <Feather name="dollar-sign" size={48} color={"white"} />
            </HStack>
            <Text
              color={"white"}
              fontSize={currentEstimative < 10000 ? 26 : 20}
              numberOfLines={1}
              maxW={170}
            >
              {currentEstimative}
            </Text>
          </VStack>

          <Pressable
            bg={bgCard}
            _pressed={{
              bgColor: bgCardPressed,
            }}
            mx={1}
            shadow={2}
            minW={180}
            h={110}
            borderRadius={4}
            p={4}
            onPress={() => {
              setSelectedSheetOpen("autonomy");
              onOpen();
            }}
          >
            <VStack>
              <HStack justifyContent="space-between">
                <Text color={text} fontSize={18}>
                  Autonomia
                </Text>
                <Feather
                  name="arrow-up-circle"
                  size={48}
                  color={theme.colors.green[500]}
                />
              </HStack>
              <Text
                color={text}
                fontSize={(veicleAutonomy ?? 0) < 10000 ? 26 : 20}
                numberOfLines={1}
                maxW={170}
              >
                {veicleAutonomy ?? 0}L
              </Text>
            </VStack>
          </Pressable>

          <VStack
            mx={1}
            shadow={2}
            bg={bgCard}
            minW={180}
            h={110}
            borderRadius={4}
            p={4}
          >
            <HStack justifyContent="space-between">
              <Text color={text} fontSize={18}>
                Km Atual
              </Text>
              <Feather
                name="arrow-up-circle"
                size={48}
                color={theme.colors.green[500]}
              />
            </HStack>
            <Text
              color={text}
              fontSize={
                (filteredList[0]?.currentDistance ?? 0) < 10000 ? 26 : 20
              }
              numberOfLines={1}
              maxW={170}
            >
              {filteredList[0]?.currentDistance ?? 0}
            </Text>
          </VStack>
        </ScrollView>

        <VStack px={4} mt={-36} space={2}>
          <Text fontSize={14} color={text}>
            * Totais referentes ao ultimo abastecimento
          </Text>

          <VStack space={2}>
            <Text color={text} fontSize={16} bold>
              Filtrar por período
            </Text>
            <HStack w={"100%"} space={2}>
              <Input
                flex={1}
                type={"text"}
                py="0"
                placeholder="Data inicio"
                value={startDate}
                editable={false}
                InputRightElement={
                  <Button
                    size="xs"
                    rounded="none"
                    w="1/4"
                    p={0}
                    h="full"
                    bgColor={theme.colors.purple[600]}
                    _pressed={{
                      bgColor: "purple.800",
                    }}
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        value: new Date(Date.now()),
                        onChange: onChangeStartDate,
                        mode: "date",
                        is24Hour: false,
                      });
                    }}
                  >
                    <Feather name="calendar" size={24} color="#FFF" />
                  </Button>
                }
              />
              <Input
                flex={1}
                type={"text"}
                py="0"
                placeholder="Data Fim"
                value={endDate}
                editable={false}
                InputRightElement={
                  <Button
                    size="xs"
                    rounded="none"
                    w="1/4"
                    p={2}
                    h="full"
                    bgColor={theme.colors.purple[600]}
                    _pressed={{
                      bgColor: "purple.800",
                    }}
                    onPress={() => {
                      DateTimePickerAndroid.open({
                        value: new Date(Date.now()),
                        onChange: onChangeEndDate,
                        mode: "date",
                        is24Hour: false,
                      });
                    }}
                  >
                    <Feather name="calendar" size={24} color="#FFF" />
                  </Button>
                }
              />
            </HStack>
          </VStack>
          <VStack space={2}>
            <Text color={text}>Clique no item para excluir</Text>
          </VStack>
          {filteredList.length === 0 ? (
            <EmptyMessage />
          ) : (
            <>
              {filteredList.map((item) => (
                <Pressable
                  bgColor={bgCard}
                  _pressed={{
                    bgColor: bgCardPressed,
                  }}
                  shadow={2}
                  borderRadius={4}
                  p={2}
                  key={item.id}
                  onPress={() => {
                    deleteTransaction(item);
                  }}
                >
                  <HStack alignItems="center" w="100%" space={2}>
                    <MaterialCommunityIcons
                      name={"fuel"}
                      size={28}
                      color={"#12a454"}
                    />
                    <VStack alignItems="flex-start" flex={1}>
                      <Text color={text} fontSize={18}>
                        {item.location}
                      </Text>
                      <Text color={text}>
                        Km no Abast.: {item.currentDistance}
                      </Text>
                      <Text color={text} fontSize={16}>
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </Text>
                      <Text color={text}>
                        {item.unityAmount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          useGrouping: true,
                        })}{" "}
                        - {(item.amount / item.unityAmount).toFixed(2)} Litros
                      </Text>
                    </VStack>
                    <VStack alignItems={"flex-end"} w={"34%"} s>
                      <Text color={text} numberOfLines={1} fontSize={18}>
                        {item.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          useGrouping: true,
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                </Pressable>
              ))}
              <HStack justifyContent="space-between" mb={6}>
                <Text color={text} fontSize={18} bold>
                  Total
                </Text>
                <Text color={text} fontSize={18} bold>
                  {listTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })}
                </Text>
              </HStack>
            </>
          )}
        </VStack>
      </ScrollView>

      {isAiEnabled && <Box w={"100%"} h={16} />}

      <AIComponent />

      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        h={height * (isKeyboardOpen ? 0.9 : 1.09)}
      >
        <Actionsheet.Content pb={isKeyboardOpen ? 24 : 0}>
          {selectedSheetOpen === "veicle" ? (
            <EditVeicleForm onClose={onClose} />
          ) : selectedSheetOpen === "autonomy" ? (
            <AutonomyForm onClose={onClose} />
          ) : (
            <ErrorSheet />
          )}
          <Box h={16} w={"100%"} />
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
