'use client';
import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '@/features/core/utils/api.client';
import type { BudgetFromAPI, ExpenseFromAPI, SettingsFromAPI } from '@/features/core/types/api.types';

function monthStr(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useBudget() {
  const [budgets,              setBudgets]              = useState<BudgetFromAPI[]>([]);
  const [allExpenses,          setAllExpenses]          = useState<ExpenseFromAPI[]>([]);
  const [monthlyIncome,        setMonthlyIncome]        = useState<number>(0);
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState<number>(0);
  const [goalAmount,           setGoalAmount]           = useState<number>(0);
  const [loading,              setLoading]              = useState(true);
  const [error,                setError]                = useState<string | null>(null);
  const [monthOffset,          setMonthOffset]          = useState(0);

  const month = monthStr(monthOffset);

  function load() {
    setLoading(true);
    Promise.all([
      apiGet<BudgetFromAPI[]>(`/api/v1/budgets?month=${month}`),
      apiGet<SettingsFromAPI>('/api/v1/settings'),
      apiGet<ExpenseFromAPI[]>(`/api/v1/expenses?month=${month}`),
    ])
      .then(([b, s, e]) => {
        setBudgets(b);
        setMonthlyIncome(parseFloat(s.monthly_income));
        setMonthlySavingsTarget(parseFloat(s.monthly_savings_target));
        setGoalAmount(parseFloat(s.goal_amount));
        setAllExpenses(e);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [month]);

  async function updateBudget(category: string, amount: number) {
    await apiPut(`/api/v1/budgets/${encodeURIComponent(category)}`, { monthly_amount: amount });
    load();
  }

  async function deleteBudget(category: string) {
    await apiDelete(`/api/v1/budgets/${encodeURIComponent(category)}`);
    load();
  }

  async function createBudget(category: string, amount: number) {
    await apiPost(`/api/v1/budgets`, { category, monthly_amount: amount });
    load();
  }

  async function confirmPayment(category: string, amount: number, date: string) {
    await apiPost('/api/v1/expenses', {
      date, category,
      description: `Pago mensual: ${category}`,
      amount, type: 'Necesidad',
    });
    load();
  }

  const spendingCap        = monthlyIncome - monthlySavingsTarget;
  const totalRealExpenses  = allExpenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const surplusSavings     = Math.max(0, spendingCap - totalRealExpenses);

  return {
    budgets, allExpenses, monthlyIncome, monthlySavingsTarget, goalAmount,
    loading, error, month, monthOffset, setMonthOffset,
    spendingCap, totalRealExpenses, surplusSavings,
    updateBudget, deleteBudget, createBudget, confirmPayment,
  };
}
