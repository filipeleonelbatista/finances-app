import { Feather } from '@expo/vector-icons';
import { Actionsheet, IconButton, Text, useDisclose } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { usePages } from '../hooks/usePages';
import AddItemForm from './AddItemForm';

export default function AddButton() {
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
      icon={<Feather name="plus" size={24} color={'#FFF'} />}
    />
    <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
      <Actionsheet.Content minH={height * 0.8}>
        {
          selectedSheet === "Finanças" ? (<AddItemForm onClose={onClose} />) : null
        }
      </Actionsheet.Content>
    </Actionsheet>
  </>;
}