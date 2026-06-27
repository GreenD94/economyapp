'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/features/core/utils/api.client';
import type { IncomeFromAPI } from '@/features/core/types/api.types';

export function monthStr(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useIncomes() {
  const [incomes, setIncomes] = useState<IncomeFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const month = monthStr(monthOffset);

  function load() {
    setLoading(true);
    apiGet<IncomeFromAPI[]>(`/api/v1/incomes?month=${month}`)
      .then(setIncomes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [month]);

  async function addIncome(body: { date: string; source: string; amount: string; type: string; notes: string | null; source_id?: number | null }) {
    await apiPost('/api/v1/incomes', body);
    load();
  }

  async function updateIncome(id: number, body: { date?: string; source?: string; amount?: string; type?: string; note?: string | null }) {
    await apiPut(`/api/v1/incomes/${id}`, body);
    load();
  }

  async function deleteIncome(id: number) {
    await apiDelete(`/api/v1/incomes/${id}`);
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }

  async function unconfirmIncome(id: number, note: string) {
    await apiPost<void>(`/api/v1/incomes/${id}/unconfirm`, { note });
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }

  return { incomes, loading, error, month, monthOffset, setMonthOffset, addIncome, updateIncome, deleteIncome, unconfirmIncome };
}
