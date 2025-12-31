import type { RecurringTransaction } from '../../recurring/types/recurring-transaction.types';

export const emptyRecurringTransaction: RecurringTransaction = {
  id: '',
  type: 'expense',
  amount: 0,
  category: '',
  description: '',
  frequency: 'monthly',
  startDate: new Date(),
  endDate: undefined,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
