'use client';

import { useMemo } from 'react';
import { useEarningsAnalytics } from '../../analytics/hooks/analytics.use-earnings-analytics';
import { subMonths } from 'date-fns';

export function useSpendingComparison() {
  const currentMonthData = useEarningsAnalytics(1);
  const previousMonthData = useEarningsAnalytics(2);

  return useMemo(() => {
    const current = currentMonthData[0];
    const previous = previousMonthData[0];

    if (!current || !previous) {
      return {
        spendingChange: 0,
        earningsChange: 0,
        balanceChange: 0,
        spendingChangePercent: 0,
        earningsChangePercent: 0,
        balanceChangePercent: 0,
      };
    }

    const spendingChange = current.spending - previous.spending;
    const earningsChange = current.earnings - previous.earnings;
    const balanceChange = current.balance - previous.balance;

    const spendingChangePercent =
      previous.spending > 0 ? (spendingChange / previous.spending) * 100 : 0;
    const earningsChangePercent =
      previous.earnings > 0 ? (earningsChange / previous.earnings) * 100 : 0;
    const balanceChangePercent =
      previous.balance !== 0 ? (balanceChange / Math.abs(previous.balance)) * 100 : 0;

    return {
      spendingChange,
      earningsChange,
      balanceChange,
      spendingChangePercent,
      earningsChangePercent,
      balanceChangePercent,
    };
  }, [currentMonthData, previousMonthData]);
}
