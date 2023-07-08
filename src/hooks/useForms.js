import { useContext } from 'react';
import { FormsContext } from '../context/FormsContext';

export function useForms() {
  const value = useContext(FormsContext)
  return value;
}