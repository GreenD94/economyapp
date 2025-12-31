'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSavingsGoal,
  getSavingsGoalList,
  updateSavingsGoal,
  deleteSavingsGoal,
} from '../server-actions/goal.server-actions';
import type { SavingsGoal } from '../types/goal.types';

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const result = await getSavingsGoalList();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch savings goals');
      }
      return result.data;
    },
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => {
      const result = await createSavingsGoal(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create savings goal');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const result = await updateSavingsGoal(id, data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update savings goal');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSavingsGoal(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete savings goal');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
}
