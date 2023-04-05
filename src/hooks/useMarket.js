import { useContext } from 'react';
import { MarketContext } from '../context/MarketContext';

export function useMarket() {
  const value = useContext(MarketContext)
  return value;
}