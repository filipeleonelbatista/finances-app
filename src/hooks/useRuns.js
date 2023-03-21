import { useContext } from 'react';
import { RunsContext } from '../context/RunsContext';

export function useRuns() {
  const value = useContext(RunsContext)
  return value;
}