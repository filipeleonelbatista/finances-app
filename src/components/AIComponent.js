import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, HStack, IconButton, Text, useColorModeValue, useTheme } from 'native-base';
import { useSettings } from '../hooks/useSettings';

export default function AIComponent() {
  const theme = useTheme();

  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);
  const bgCard = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[800]);

  const navigation = useNavigation();

  const {
    isAiEnabled
  } = useSettings();

  if (!isAiEnabled) return null;

  return (
    <HStack
      position={'absolute'}
      bottom={8}
      left={4}
      space={4}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <IconButton
        bgColor={"purple.600"}
        w={10}
        h={10}
        alignItems={'center'}
        justifyContent={'center'}
        onPress={() => navigation.navigate("IAPage")}
        borderRadius={'full'}
        shadow={4}
        _pressed={{
          color: theme.colors.purple[900]
        }}
        icon={<MaterialCommunityIcons name="robot-outline" size={20} color={theme.colors.white} />}
      />
      <Box
        bg={bgCard}
        py={0.5}
        px={2}
        borderRadius={4}
        shadow={4}
      >
        <Text color={text}>Converser com a IA</Text>
      </Box>
    </HStack>
  );
}