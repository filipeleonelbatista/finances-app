import { Feather } from '@expo/vector-icons';
import { Actionsheet, IconButton, Text, useDisclose } from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useForms } from '../hooks/useForms';

export default function AddButton() {
  const { height } = useWindowDimensions();

  const { selectedSheet } = useForms();

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
        <Text>{selectedSheet}</Text>
      </Actionsheet.Content>
    </Actionsheet>
  </>;
}