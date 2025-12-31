'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRecurringTransaction,
  getRecurringTransactionList,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  processRecurringTransactions,
} from '../server-actions/recurring.server-actions';
import type { RecurringTransaction } from '../types/recurring.types';

export function useRecurringTransactions() {
  return useQuery({
    queryKey: ['recurringTransactions'],
    queryFn: async () => {
      const result = await getRecurringTransactionList();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch recurring transactions');
      }
      return result.data;
    },
  });
}

export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await createRecurringTransaction(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create recurring transaction');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
    },
  });
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const result = await updateRecurringTransaction(id, data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update recurring transaction');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
    },
  });
}

export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteRecurringTransaction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete recurring transaction');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
    },
  });
}

export function useProcessRecurringTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await processRecurringTransactions();
      if (!result.success || result.data === undefined) {
        throw new Error(result.error || 'Failed to process recurring transactions');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['recurringTransactions'] });
    },
  });
}
