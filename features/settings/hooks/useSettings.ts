'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '@/features/core/utils/api.client';
import type { SettingsFromAPI } from '@/features/core/types/api.types';

export function useSettings() {
  const [settings, setSettings] = useState<SettingsFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function load() {
    setLoading(true);
    apiGet<SettingsFromAPI>('/api/v1/settings')
      .then(setSettings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function save(data: {
    goal_amount: number;
    monthly_income: number;
    monthly_savings_target: number;
  }) {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await apiPut<SettingsFromAPI>('/api/v1/settings', data);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return { settings, loading, saving, saved, error, save };
}
