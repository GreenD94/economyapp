'use client';

import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { MonthlyData } from '../types/analytics.types';

export function useEarningsAnalytics(months: number = 6) {
  const { data: transactions = [] } = useTransactions();

  return useMemo<MonthlyData[]>(() => {
    const now = new Date();
    const monthlyData: MonthlyData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const spending = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const earnings = monthTransactions
        .filter((t) => t.type === 'earning')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: format(date, 'MMM yyyy'),
        spending,
        earnings,
        balance: earnings - spending,
      });
    }

    return monthlyData;
  }, [transactions, months]);
}
