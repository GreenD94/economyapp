'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '@/features/core/utils/api.client';
import type { SettingsFromAPI, IncomeFromAPI, ExpenseFromAPI } from '@/features/core/types/api.types';

function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export type DashboardData = {
  settings: SettingsFromAPI | null;
  incomes: IncomeFromAPI[];
  expenses: ExpenseFromAPI[];
  loading: boolean;
  error: string | null;
};

export function useDashboard(): DashboardData {
  const [settings, setSettings] = useState<SettingsFromAPI | null>(null);
  const [incomes, setIncomes] = useState<IncomeFromAPI[]>([]);
  const [expenses, setExpenses] = useState<ExpenseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const month = currentMonthStr();
    Promise.all([
      apiGet<SettingsFromAPI>('/api/v1/settings'),
      apiGet<IncomeFromAPI[]>(`/api/v1/incomes?month=${month}`),
      apiGet<ExpenseFromAPI[]>(`/api/v1/expenses?month=${month}`),
    ])
      .then(([s, i, e]) => { setSettings(s); setIncomes(i); setExpenses(e); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { settings, incomes, expenses, loading, error };
}
