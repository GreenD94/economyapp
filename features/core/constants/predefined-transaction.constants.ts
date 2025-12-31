import type { PredefinedTransaction } from '../../predefined-transactions/types/predefined-transaction.types';

export const emptyPredefinedTransaction: PredefinedTransaction = {
  id: '',
  name: '',
  type: 'expense',
  amount: 0,
  category: '',
  description: '',
  icon: 'tag',
  color: '#6b7280',
  createdAt: new Date(),
};
