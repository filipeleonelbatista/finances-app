import { useContext } from 'react';
import { GoalsContext } from '../context/GoalsContext';

export function useGoals() {
  const value = useContext(GoalsContext)
  return value;
}