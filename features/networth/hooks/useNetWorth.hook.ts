'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/features/core/utils/api.client';
import type { NetWorthEntryFromAPI } from '@/features/core/types/api.types';

export function useNetWorth() {
  const [entries, setEntries] = useState<NetWorthEntryFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiGet<NetWorthEntryFromAPI[]>('/api/v1/patrimonio')
      .then(setEntries)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function addEntry(body: { month: string; amount: number; notes?: string }) {
    await apiPost('/api/v1/patrimonio', body);
    load();
  }

  async function updateEntry(id: number, body: { month?: string; amount?: number; notes?: string }) {
    await apiPut(`/api/v1/patrimonio/${id}`, body);
    load();
  }

  async function deleteEntry(id: number) {
    await apiDelete(`/api/v1/patrimonio/${id}`);
    load();
  }

  return { entries, loading, error, addEntry, updateEntry, deleteEntry };
}
