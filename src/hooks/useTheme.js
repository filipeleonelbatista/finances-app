import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const value = useContext(ThemeContext)
  return value;
}