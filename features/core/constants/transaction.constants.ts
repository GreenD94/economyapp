import type { Transaction } from '../../transactions/types/transaction.types';

export const emptyTransaction: Transaction = {
  id: '',
  type: 'expense',
  amount: 0,
  category: '',
  description: '',
  date: new Date(),
  createdAt: new Date(),
};
