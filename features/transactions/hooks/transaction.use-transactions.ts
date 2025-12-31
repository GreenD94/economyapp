'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTransaction,
  getTransactionList,
  updateTransaction,
  deleteTransaction,
} from '../server-actions/transaction.server-actions';
import type { Transaction, TransactionFilters } from '../types/transaction.types';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const result = await getTransactionList(filters);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch transactions');
      }
      return result.data;
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
      const result = await createTransaction(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create transaction');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Transaction, 'id' | 'createdAt'>>;
    }) => {
      const result = await updateTransaction(id, data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update transaction');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTransaction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete transaction');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
