'use client';

import { useMemo } from 'react';
import { useSpendingAnalytics } from '../../analytics/hooks/analytics.use-spending-analytics';
import { useCategoryBudgets } from '../../budgets/hooks/budget.use-budgets';
import { useEarningsAnalytics } from '../../analytics/hooks/analytics.use-earnings-analytics';
import type { HealthScore } from '../types/health.types';

export function useHealthScore(): HealthScore {
  const analytics = useSpendingAnalytics();
  const { data: budgets = [] } = useCategoryBudgets();
  const monthlyData = useEarningsAnalytics(3);

  return useMemo<HealthScore>(() => {
    const spendingRatio =
      analytics.monthlyEarnings > 0
        ? (analytics.monthlySpending / analytics.monthlyEarnings) * 100
        : 100;
    const spendingRatioScore = Math.max(0, 100 - spendingRatio);

    const savingsRate =
      analytics.monthlyEarnings > 0
        ? (analytics.monthlyBalance / analytics.monthlyEarnings) * 100
        : 0;
    const savingsRateScore = Math.min(100, Math.max(0, savingsRate * 2));

    const budgetAdherence =
      budgets.length > 0
        ? budgets.reduce((sum, budget) => {
            const adherence = budget.monthlyBudget > 0
              ? Math.min(100, (budget.monthlyBudget / (budget.currentSpending || 1)) * 100)
              : 100;
            return sum + Math.min(100, adherence);
          }, 0) / budgets.length
        : 50;
    const budgetAdherenceScore = Math.min(100, budgetAdherence);

    const trend = monthlyData.length >= 2
      ? monthlyData.slice(-2).reduce((sum, month) => sum + (month.balance > 0 ? 1 : -1), 0) * 25
      : 50;
    const trendScore = Math.max(0, Math.min(100, 50 + trend));

    const score = (spendingRatioScore + savingsRateScore + budgetAdherenceScore + trendScore) / 4;

    return {
      score,
      factors: {
        spendingRatio,
        savingsRate,
        budgetAdherence: budgetAdherenceScore,
        trend: trendScore,
      },
    };
  }, [analytics, budgets, monthlyData]);
}
