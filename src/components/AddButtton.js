import { Feather } from "@expo/vector-icons";
import {
  Actionsheet,
  Box,
  IconButton,
  useDisclose,
  useTheme,
} from "native-base";
import { useWindowDimensions } from "react-native";
import { usePages } from "../hooks/usePages";
import AddItemForm from "./AddItemForm";
import AddFuelForm from "./AddFuelForm";
import AddShoppingCartItem from "./AddShoppingCartItem";
import AddGoalForm from "./AddGoalForm";
import ErrorSheet from "./ErrorSheet";
import { useMemo } from "react";
import { useIsKeyboardOpen } from "../hooks/useIsKeyboardOpen";

export default function AddButton() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const isKeyboardOpen = useIsKeyboardOpen();

  const { isOpen, onOpen, onClose } = useDisclose();

  const { selectedSheet } = usePages();

  const selectedComponent = useMemo(() => {
    switch (selectedSheet) {
      case "Finanças":
        return <AddItemForm onClose={onClose} />;
      case "Combustível":
        return <AddFuelForm onClose={onClose} />;
      case "Stock":
        return <AddShoppingCartItem onClose={onClose} />;
      case "List":
        return <AddShoppingCartItem onClose={onClose} />;
      case "Relatórios":
        return <AddGoalForm onClose={onClose} />;
      default:
        return <ErrorSheet />;
    }
  }, [selectedSheet]);

  return (
    <>
      <IconButton
        bgColor={"purple.600"}
        w={16}
        h={16}
        onPress={onOpen}
        borderRadius={"full"}
        mt={-6}
        shadow={4}
        _pressed={{
          color: theme.colors.purple[900],
        }}
        icon={<Feather name="plus" size={26} color={theme.colors.white} />}
      />
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        h={height * (isKeyboardOpen ? 0.9 : 1.09)}
      >
        <Actionsheet.Content pb={isKeyboardOpen ? 24 : 0}>
          {selectedComponent}
          <Box h={16} w={"100%"} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
