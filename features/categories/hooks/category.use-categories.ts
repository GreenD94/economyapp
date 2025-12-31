'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  getCategoryList,
  updateCategory,
  deleteCategory,
} from '../server-actions/category.server-actions';
import type { Category } from '../types/category.types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getCategoryList();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      return result.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Category, 'id' | 'createdAt'>) => {
      const result = await createCategory(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Category, 'id' | 'createdAt' | 'isPredefined'>>;
    }) => {
      const result = await updateCategory(id, data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategory(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
