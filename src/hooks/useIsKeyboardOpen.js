import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useIsKeyboardOpen() {
  const [isKeybordOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return isKeybordOpen;
}