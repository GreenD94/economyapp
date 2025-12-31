'use client';

import { BudgetProgressCard } from './budget.budget-progress-card';
import { BudgetAlert } from './budget.budget-alert';
import type { CategoryBudget } from '../types/budget.types';
import type { Category } from '../../categories/types/category.types';

interface BudgetListProps {
  budgets: CategoryBudget[];
  categories: Category[];
  onEdit: (budget: CategoryBudget) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function BudgetList({
  budgets,
  categories,
  onEdit,
  onDelete,
  isLoading,
}: BudgetListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No budgets set yet</p>
        <p className="mt-2 text-sm text-gray-400">
          Set budgets for your categories to track spending
        </p>
      </div>
    );
  }

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const category = categoryMap.get(budget.categoryId);
        if (!category) return null;

        return (
          <div key={budget.id}>
            <BudgetAlert budget={budget} categoryName={category.name} />
            <BudgetProgressCard
              budget={budget}
              categoryName={category.name}
              categoryColor={category.color}
            />
          </div>
        );
      })}
    </div>
  );
}
