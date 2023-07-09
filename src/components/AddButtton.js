import { Feather } from '@expo/vector-icons';
import { Actionsheet, IconButton, useDisclose, useTheme } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { usePages } from '../hooks/usePages';
import AddItemForm from './AddItemForm';
import AddFuelForm from './AddFuelForm';
import AddShoppingCartItem from './AddShoppingCartItem';
import AddGoalForm from './AddGoalForm';
import ErrorSheet from './ErrorSheet';
import { useMemo } from 'react';

export default function AddButton() {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  const { selectedSheet } = usePages();

  const selectedComponent = useMemo(() => {
    switch (selectedSheet) {
      case 'Finanças':
        return <AddItemForm onClose={onClose} />
      case 'Combustível':
        return <AddFuelForm onClose={onClose} />
      case 'Mercado':
        return <AddShoppingCartItem onClose={onClose} />
      case 'Relatórios':
        return <AddGoalForm onClose={onClose} />
      default:
        return <ErrorSheet />
    }
  }, [selectedSheet])

  return <>
    <IconButton
      bgColor={"purple.600"}
      w={16}
      h={16}
      onPress={onOpen}
      borderRadius={'full'}
      mt={-6}
      shadow={4}
      _pressed={{
        color: theme.colors.purple[300]
      }}
      icon={<Feather name="plus" size={26} color={theme.colors.white} />}
    />
    <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
      <Actionsheet.Content minH={height * 0.8}>
        {
          selectedComponent
        }
      </Actionsheet.Content>
    </Actionsheet>
  </>;
}