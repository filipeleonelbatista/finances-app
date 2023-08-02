import { Box, HStack, Text, useColorModeValue, useTheme } from "native-base";
import { ImageBackground } from "react-native";

import bgImg from "../assets/images/background.png";

export default function Header({
  title,
  isLeftIconComponent = false,
  isRightIconComponent = false,
  isShort = false,
}) {
  const theme = useTheme();

  const bg = useColorModeValue(
    theme.colors.warmGray[50],
    theme.colors.gray[900]
  );

  return (
    <ImageBackground
      source={bgImg}
      style={{
        paddingTop: 12,
        height: isShort ? 70 : 130,
        width: "100%",
        backgroundColor: theme.colors.purple[600],
      }}
    >
      <HStack justifyContent="space-between" alignItems={"center"} px={4}>
        {isLeftIconComponent ? isLeftIconComponent : <Box w={10} />}
        <Text color={bg} bold fontSize={28}>
          {title}
          <Text color={theme.colors.purple[900]}>$</Text>
        </Text>
        {isRightIconComponent ? isRightIconComponent : <Box w={10} />}
      </HStack>
    </ImageBackground>
  );
}
