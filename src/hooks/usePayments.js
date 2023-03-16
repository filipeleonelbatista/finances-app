import { useContext } from 'react';
import { PaymentsContext } from '../context/PaymentsContext';

export function usePayments() {
  const value = useContext(PaymentsContext)
  return value;
}