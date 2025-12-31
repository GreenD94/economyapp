'use client';

import { useState, useEffect } from 'react';
import type { CategoryBudget } from '../types/budget.types';
import { formatCurrency } from '@/features/core/utils';

interface BudgetFormProps {
  initialData?: CategoryBudget;
  categoryName: string;
  onSubmit: (data: Partial<Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BudgetForm({
  initialData,
  categoryName,
  onSubmit,
  onCancel,
  isLoading,
}: BudgetFormProps) {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  useEffect(() => {
    if (initialData) {
      setMonthlyBudget(initialData.monthlyBudget.toString());
      setPeriod(initialData.period);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetNumber = parseFloat(monthlyBudget);
    if (isNaN(budgetNumber) || budgetNumber < 0) {
      return;
    }

    onSubmit({
      monthlyBudget: budgetNumber,
      period,
    });
  };

  const parsedBudget = parseFloat(monthlyBudget) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Category: {categoryName}
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Monthly Budget (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="0.00"
            required
          />
        </div>
        {parsedBudget > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {formatCurrency(parsedBudget)} per month
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors active:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors active:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
