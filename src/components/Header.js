
import { Box, HStack, Text, useColorModeValue, useTheme } from 'native-base';
import { ImageBackground, View } from 'react-native';


import bgImg from '../assets/images/background.png';

export default function Header({ title, iconComponent }) {
  const theme = useTheme();

  const bg = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[900]);
  const headerText = useColorModeValue('white', theme.colors.gray[800]);

  return (
    <ImageBackground source={bgImg} style={{
      paddingTop: 12,
      height: 130,
      width: '100%',
      backgroundColor: theme.colors.purple[600],
    }}>
      <HStack alignItems="center" justifyContent='space-between' px={4}>
        <Box w={10} />
        <Text
          color={headerText}
          bold
          fontSize={28}
        >
          {title}<Text color={theme.colors.purple[800]}>$</Text>
        </Text>
        {iconComponent}
      </HStack>
    </ImageBackground>
  )
}