'use client';

import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { useCategories } from '../../categories/hooks/category.use-categories';
import { getMonthStart, getMonthEnd } from '@/features/core/utils';
import type { CategoryBreakdown } from '../types/analytics.types';

export function useCategoryBreakdown() {
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  const { data: transactions = [] } = useTransactions({
    type: 'expense',
    startDate: monthStart,
    endDate: monthEnd,
  });

  const { data: categories = [] } = useCategories();

  return useMemo<CategoryBreakdown[]>(() => {
    const categoryMap = new Map<string, { amount: number; color: string }>();

    transactions.forEach((transaction) => {
      const existing = categoryMap.get(transaction.category) || {
        amount: 0,
        color: '#6b7280',
      };
      const category = categories.find((c) => c.name === transaction.category);
      categoryMap.set(transaction.category, {
        amount: existing.amount + transaction.amount,
        color: category?.color || '#6b7280',
      });
    });

    const total = Array.from(categoryMap.values()).reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        color: data.color,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);
}
