import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export function useSettings() {
  const value = useContext(SettingsContext)
  return value;
}