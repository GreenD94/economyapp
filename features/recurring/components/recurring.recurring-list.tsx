'use client';

import { RecurringItem } from './recurring.recurring-item';
import type { RecurringTransaction } from '../types/recurring-transaction.types';

interface RecurringListProps {
  transactions: RecurringTransaction[];
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
  isLoading?: boolean;
}

export function RecurringList({
  transactions,
  onEdit,
  onDelete,
  onToggle,
  isLoading,
}: RecurringListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No recurring transactions set up</p>
        <p className="mt-2 text-sm text-gray-400">
          Create recurring transactions for bills, salary, and other regular income or expenses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <RecurringItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
