'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategoryBudget,
  getCategoryBudgetList,
  getCategoryBudgetByCategory,
  updateCategoryBudget,
  deleteCategoryBudget,
} from '../server-actions/budget.server-actions';
import type { CategoryBudget } from '../types/budget.types';

export function useCategoryBudgets() {
  return useQuery({
    queryKey: ['categoryBudgets'],
    queryFn: async () => {
      const result = await getCategoryBudgetList();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch category budgets');
      }
      return result.data;
    },
  });
}

export function useCategoryBudgetByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['categoryBudget', categoryId],
    queryFn: async () => {
      const result = await getCategoryBudgetByCategory(categoryId);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch category budget');
      }
      return result.data;
    },
    enabled: categoryId !== '',
  });
}

export function useCreateCategoryBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>) => {
      const result = await createCategoryBudget(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create category budget');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryBudgets'] });
    },
  });
}

export function useUpdateCategoryBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const result = await updateCategoryBudget(id, data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update category budget');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryBudgets'] });
    },
  });
}

export function useDeleteCategoryBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryBudget(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category budget');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryBudgets'] });
    },
  });
}
