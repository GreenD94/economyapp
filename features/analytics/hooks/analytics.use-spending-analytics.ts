'use client';

import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { getMonthStart, getMonthEnd } from '@/features/core/utils';
import type { SpendingAnalytics } from '../types/analytics.types';

export function useSpendingAnalytics() {
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  const { data: allTransactions = [] } = useTransactions();
  const { data: monthlyTransactions = [] } = useTransactions({
    startDate: monthStart,
    endDate: monthEnd,
  });

  return useMemo<SpendingAnalytics>(() => {
    const expenses = allTransactions.filter((t) => t.type === 'expense');
    const earnings = allTransactions.filter((t) => t.type === 'earning');

    const monthlyExpenses = monthlyTransactions.filter((t) => t.type === 'expense');
    const monthlyEarningsTransactions = monthlyTransactions.filter((t) => t.type === 'earning');

    const totalSpending = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalEarnings - totalSpending;

    const monthlySpending = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
    const monthlyEarnings = monthlyEarningsTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyBalance = monthlyEarnings - monthlySpending;

    return {
      totalSpending,
      totalEarnings,
      balance,
      monthlySpending,
      monthlyEarnings,
      monthlyBalance,
    };
  }, [allTransactions, monthlyTransactions]);
}
