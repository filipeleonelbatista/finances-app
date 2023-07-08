import { useContext } from 'react';
import { PagesContext } from '../context/PagesContext';

export function usePages() {
  const value = useContext(PagesContext)
  return value;
}