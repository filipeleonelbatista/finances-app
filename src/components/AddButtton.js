import { Feather } from '@expo/vector-icons';
import { Actionsheet, IconButton, useDisclose, useTheme } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { usePages } from '../hooks/usePages';
import AddItemForm from './AddItemForm';
import AddFuelForm from './AddFuelForm';

export default function AddButton() {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  const { selectedSheet } = usePages();

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  return <>
    <IconButton
      bgColor={"purple.600"}
      w={16}
      h={16}
      onPress={onOpen}
      borderRadius={'full'}
      mt={-6}
      _pressed={{
        color: theme.colors.purple[300]
      }}
      icon={<Feather name="plus" size={26} color={theme.colors.white} />}
    />
    <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
      <Actionsheet.Content minH={height * 0.8}>
        {
          selectedSheet === "Finanças" ? (<AddItemForm onClose={onClose} />) : null
        }
        {
          selectedSheet === "Combustível" ? (<AddFuelForm onClose={onClose} />) : null
        }
      </Actionsheet.Content>
    </Actionsheet>
  </>;
}