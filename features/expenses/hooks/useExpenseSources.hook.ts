'use client';
import { useEffect, useState } from 'react';
import { apiDelete, apiPost, apiPut, apiGet } from '@/features/core/utils/api.client';
import type { ExpenseSourceFromAPI } from '@/features/core/types/api.types';

export function useExpenseSources() {
  const [sources, setSources] = useState<ExpenseSourceFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiGet<ExpenseSourceFromAPI[]>('/api/v1/expense-sources')
      .then(setSources)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addSource(body: {
    label:          string;
    category:       string;
    classification: string;
    expense_type:   string;
    frequency:      string;
    base_amount:    number | null;
    due_day?:       number;
  }) {
    const created = await apiPost<ExpenseSourceFromAPI>('/api/v1/expense-sources', body);
    setSources(prev => [...prev, created]);
    return created;
  }

  async function updateSource(id: number, body: Partial<{
    label:          string;
    category:       string;
    classification: string;
    expense_type:   string;
    frequency:      string;
    base_amount:    number | null;
    due_day:        number;
    is_active:      boolean;
  }>) {
    const updated = await apiPut<ExpenseSourceFromAPI>(`/api/v1/expense-sources/${id}`, body);
    setSources(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }

  async function deleteSource(id: number) {
    await apiDelete(`/api/v1/expense-sources/${id}`);
    setSources(prev => prev.filter(s => s.id !== id));
  }

  return { sources, loading, error, addSource, updateSource, deleteSource };
}
