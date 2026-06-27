'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/features/core/utils/api.client';
type UpdateExpenseBody = { date?: string; category?: string; description?: string; amount?: string; type?: string; note?: string | null };
import type { ExpenseFromAPI } from '@/features/core/types/api.types';

export const CATEGORIES = [
  'Arriendo','Electricidad','Agua','Gas','Internet','Telefono',
  'Alimentacion','Transporte','Higiene','Salud','Casa','Gym','Carro',
  'Claude','Ocio','Imprevistos','Caprichos','Tecnologia',
] as const;

export const EXPENSE_TYPES = ['Necesidad', 'Calidad de vida', 'Productividad', 'Capricho'] as const;

function monthStr(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const month = monthStr(monthOffset);

  function load() {
    setLoading(true);
    apiGet<ExpenseFromAPI[]>(`/api/v1/expenses?month=${month}`)
      .then(setExpenses)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [month]);

  const filteredExpenses = expenses.filter(e =>
    (categoryFilters.length === 0 || categoryFilters.includes(e.category)) &&
    (typeFilters.length === 0 || typeFilters.includes(e.type))
  );

  async function addExpense(body: Omit<ExpenseFromAPI, 'id' | 'created_at'>) {
    await apiPost('/api/v1/expenses', body);
    load();
  }

  async function updateExpense(id: number, body: UpdateExpenseBody) {
    await apiPut(`/api/v1/expenses/${id}`, body);
    load();
  }

  async function deleteExpense(id: number) {
    await apiDelete(`/api/v1/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  async function unconfirmExpense(id: number, note: string) {
    await apiPost(`/api/v1/expenses/${id}/unconfirm`, { note });
    load();
  }

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    allCount: expenses.length,
    loading, error, month, monthOffset, setMonthOffset,
    categoryFilters, setCategoryFilters,
    typeFilters, setTypeFilters,
    addExpense, updateExpense, deleteExpense, unconfirmExpense,
    reload: load,
  };
}
