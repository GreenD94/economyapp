'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSpendingLimit,
  updateSpendingLimit,
} from '../server-actions/limit.server-actions';
import type { SpendingLimit } from '../types/limit.types';

export function useSpendingLimit() {
  return useQuery({
    queryKey: ['spendingLimit'],
    queryFn: async () => {
      const result = await getSpendingLimit();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch spending limit');
      }
      return result.data;
    },
  });
}

export function useUpdateSpendingLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<Omit<SpendingLimit, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const result = await updateSpendingLimit(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update spending limit');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spendingLimit'] });
    },
  });
}
