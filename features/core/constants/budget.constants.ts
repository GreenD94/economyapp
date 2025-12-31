import type { CategoryBudget } from '../../budgets/types/budget.types';

export const emptyCategoryBudget: CategoryBudget = {
  id: '',
  categoryId: '',
  monthlyBudget: 0,
  currentSpending: 0,
  period: 'month',
  createdAt: new Date(),
  updatedAt: new Date(),
};
