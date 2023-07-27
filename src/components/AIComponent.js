import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Box, HStack, IconButton, Text, useColorModeValue, useTheme } from 'native-base';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useSettings } from '../hooks/useSettings';

export default function AIComponent() {
  const theme = useTheme();

  const text = useColorModeValue(theme.colors.gray[600], theme.colors.gray[200]);
  const bgCard = useColorModeValue(theme.colors.warmGray[50], theme.colors.gray[800]);

  const navigation = useNavigation();

  const {
    isAiEnabled
  } = useSettings();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tiltValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  const handlePulse = () => {
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        Animated.delay(4000).start(handlePulse);
      }
    });
  };

  const interpolatedPulse = pulseValue.interpolate({
    inputRange: [1, 1.1],
    outputRange: [1, 1.1], // Aqui você pode ajustar o efeito de pulsação
  });

  const handleTilt = () => {
    const tiltAnimation = Animated.sequence([
      Animated.timing(tiltValue, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: -0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: -0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(tiltValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(tiltAnimation, { iterations: 3000 }).start();
  };

  const tiltInterpolate = tiltValue.interpolate({
    inputRange: [-0.5, 0.5],
    outputRange: ['-5deg', '5deg'], // Aqui você pode ajustar o ângulo do tilt
  });

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      handleTilt();

      handlePulse();

      const fadeOutAnimation = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      });

      const timer = setTimeout(() => {
        fadeOutAnimation.start();
      }, 6000);

      return () => {
        clearTimeout(timer);
        fadeOutAnimation.stop();
      };
    }
  }, []);


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
      <Animated.View
        style={{
          transform: [{ scale: interpolatedPulse }],
          padding: 0,
        }}
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
      </Animated.View>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Animated.View
          style={{
            transform: [{ rotate: tiltInterpolate }],
            padding: 0,
          }}
        >
          <Box
            bg={bgCard}
            py={0.5}
            px={2}
            borderRadius={4}
            shadow={4}
          >
            <Text color={text}>Converser com a IA</Text>
          </Box>
        </Animated.View>
      </Animated.View>
    </HStack>
  );
}