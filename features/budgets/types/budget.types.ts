import type { ObjectId } from 'mongodb';

export interface CategoryBudget {
  id: string;
  categoryId: string;
  monthlyBudget: number;
  currentSpending: number;
  period: 'month' | 'year';
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBudgetDocument {
  _id: ObjectId;
  categoryId: string;
  monthlyBudget: number;
  currentSpending: number;
  period: 'month' | 'year';
  createdAt: Date;
  updatedAt: Date;
}
