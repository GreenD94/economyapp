'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPredefinedTransactionList,
  executePredefinedTransaction,
} from '../server-actions/predefined-transaction.server-actions';

export function usePredefinedTransactions() {
  return useQuery({
    queryKey: ['predefinedTransactions'],
    queryFn: async () => {
      const result = await getPredefinedTransactionList();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch predefined transactions');
      }
      return result.data;
    },
  });
}

export function useExecutePredefinedTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount?: number }) => {
      const result = await executePredefinedTransaction(id, amount);
      if (!result.success) {
        throw new Error(result.error || 'Failed to execute predefined transaction');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
