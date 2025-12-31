'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSettings, updateUserSettings } from '../server-actions/settings.server-actions';
import type { UserSettings } from '../types/settings.types';

export function useUserSettings() {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const result = await getUserSettings();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch settings');
      }
      return result.data;
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const result = await updateUserSettings(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update settings');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}
