'use client';
import { useEffect, useState } from 'react';
import { apiDelete, apiPost, apiPut, apiGet } from '@/features/core/utils/api.client';
import type { IncomeSourceFromAPI } from '@/features/core/types/api.types';

export function useIncomeSources() {
  const [sources, setSources] = useState<IncomeSourceFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiGet<IncomeSourceFromAPI[]>('/api/v1/income-sources')
      .then(setSources)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addSource(body: {
    label: string;
    income_type: string;
    frequency: string;
    base_amount: number | null;
    due_day?: number;
  }) {
    const created = await apiPost<IncomeSourceFromAPI>('/api/v1/income-sources', body);
    setSources(prev => [...prev, created]);
    return created;
  }

  async function updateSource(id: number, body: Partial<{
    label: string;
    income_type: string;
    frequency: string;
    base_amount: number | null;
    due_day: number;
    is_active: boolean;
    note: string | null;
  }>) {
    const updated = await apiPut<IncomeSourceFromAPI>(`/api/v1/income-sources/${id}`, body);
    setSources(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }

  async function deleteSource(id: number) {
    await apiDelete(`/api/v1/income-sources/${id}`);
    setSources(prev => prev.filter(s => s.id !== id));
  }

  return { sources, loading, error, addSource, updateSource, deleteSource };
}
