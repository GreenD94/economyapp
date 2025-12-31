'use client';

import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/features/core/utils';
import type { CategoryBudget } from '../types/budget.types';

interface BudgetAlertProps {
  budget: CategoryBudget;
  categoryName: string;
}

export function BudgetAlert({ budget, categoryName }: BudgetAlertProps) {
  if (budget.monthlyBudget === 0) {
    return null;
  }

  const isOverBudget = budget.currentSpending > budget.monthlyBudget;
  const percentage = (budget.currentSpending / budget.monthlyBudget) * 100;

  if (!isOverBudget && percentage < 90) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        isOverBudget
          ? 'border-red-200 bg-red-50'
          : 'border-orange-200 bg-orange-50'
      }`}
    >
      <AlertTriangle
        className={`mt-0.5 ${isOverBudget ? 'text-red-600' : 'text-orange-600'}`}
        size={20}
      />
      <div className="flex-1">
        <p
          className={`font-medium ${
            isOverBudget ? 'text-red-800' : 'text-orange-800'
          }`}
        >
          {isOverBudget
            ? `You've exceeded your ${categoryName} budget!`
            : `You're close to your ${categoryName} budget limit`}
        </p>
        <p
          className={`mt-1 text-sm ${
            isOverBudget ? 'text-red-600' : 'text-orange-600'
          }`}
        >
          {isOverBudget
            ? `Spent ${formatCurrency(budget.currentSpending)} of ${formatCurrency(budget.monthlyBudget)} (${percentage.toFixed(1)}%)`
            : `Spent ${formatCurrency(budget.currentSpending)} of ${formatCurrency(budget.monthlyBudget)} (${percentage.toFixed(1)}%)`}
        </p>
      </div>
    </div>
  );
}
