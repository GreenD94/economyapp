'use client';

import { formatCurrency } from '@/features/core/utils';
import type { CategoryBudget } from '../types/budget.types';

interface BudgetProgressCardProps {
  budget: CategoryBudget;
  categoryName: string;
  categoryColor: string;
}

export function BudgetProgressCard({
  budget,
  categoryName,
  categoryColor,
}: BudgetProgressCardProps) {
  if (budget.monthlyBudget === 0) {
    return null;
  }

  const percentage = Math.min((budget.currentSpending / budget.monthlyBudget) * 100, 100);
  const isOverBudget = budget.currentSpending > budget.monthlyBudget;
  const remaining = budget.monthlyBudget - budget.currentSpending;

  const getColorClasses = () => {
    if (isOverBudget) return 'bg-red-600';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (isOverBudget) return 'text-red-700';
    if (percentage >= 90) return 'text-orange-700';
    if (percentage >= 75) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="font-medium text-gray-900">{categoryName}</span>
        </div>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          {formatCurrency(budget.currentSpending)} / {formatCurrency(budget.monthlyBudget)}
        </span>
        <span className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
          {isOverBudget ? 'Over by ' : 'Remaining: '}
          {formatCurrency(Math.abs(remaining))}
        </span>
      </div>
    </div>
  );
}
