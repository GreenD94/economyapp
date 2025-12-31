import type { SavingsGoal } from '../../goals/types/goal.types';

export const emptySavingsGoal: SavingsGoal = {
  id: '',
  name: '',
  targetAmount: 0,
  currentAmount: 0,
  targetDate: new Date(),
  description: '',
  icon: 'target',
  color: '#3b82f6',
  createdAt: new Date(),
  updatedAt: new Date(),
};
