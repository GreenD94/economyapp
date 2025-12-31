'use client';

import { SettingsForm } from '../components/settings.settings-form';
import { useUserSettings, useUpdateUserSettings } from '../hooks/settings.use-settings';

export function SettingsContainer() {
  const { data: settings, isLoading } = useUserSettings();
  const updateMutation = useUpdateUserSettings();

  const handleSubmit = async (
    data: Partial<Omit<typeof settings, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      await updateMutation.mutateAsync(data);
      alert('Settings saved successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <SettingsForm
            initialData={settings}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
