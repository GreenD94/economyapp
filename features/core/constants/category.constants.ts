import type { Category } from '../../categories/types/category.types';

export const emptyCategory: Category = {
  id: '',
  name: '',
  icon: 'tag',
  color: '#6b7280',
  isPredefined: false,
  createdAt: new Date(),
};

export const PREDEFINED_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Food', icon: 'utensils', color: '#ef4444', isPredefined: true },
  { name: 'Transport', icon: 'car', color: '#3b82f6', isPredefined: true },
  { name: 'Entertainment', icon: 'film', color: '#8b5cf6', isPredefined: true },
  { name: 'Bills', icon: 'file-text', color: '#f59e0b', isPredefined: true },
  { name: 'Shopping', icon: 'shopping-bag', color: '#ec4899', isPredefined: true },
  { name: 'Health', icon: 'heart', color: '#10b981', isPredefined: true },
  { name: 'Education', icon: 'book', color: '#6366f1', isPredefined: true },
  { name: 'Other', icon: 'tag', color: '#6b7280', isPredefined: true },
];
