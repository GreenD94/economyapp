'use client';

import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { getMonthStart, getMonthEnd, getDaysInMonth } from '@/features/core/utils';
import { differenceInDays } from 'date-fns';

export function useMonthlyProjection() {
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();
  const now = new Date();

  const { data: transactions = [] } = useTransactions({
    startDate: monthStart,
    endDate: now,
  });

  return useMemo(() => {
    const daysElapsed = differenceInDays(now, monthStart) + 1;
    const totalDays = getDaysInMonth(now);

    const currentSpending = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const dailyAverage = daysElapsed > 0 ? currentSpending / daysElapsed : 0;
    const projectedSpending = dailyAverage * totalDays;

    return {
      currentSpending,
      projectedSpending,
      daysElapsed,
      totalDays,
      dailyAverage,
    };
  }, [transactions, monthStart, now]);
}
