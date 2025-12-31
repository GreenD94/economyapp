'use client';

import { formatDateShort, formatCurrency } from '@/features/core/utils';
import type { Transaction } from '../types/transaction.types';
import { Trash2, Edit2 } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isExpense = transaction.type === 'expense';
  const amountColor = isExpense ? 'text-red-600' : 'text-green-600';
  const amountPrefix = isExpense ? '-' : '+';

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow active:shadow-md touch-manipulation">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {transaction.description || 'No description'}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {transaction.category}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span>{formatDateShort(transaction.date)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-lg font-semibold ${amountColor}`}>
          {amountPrefix}
          {formatCurrency(Math.abs(transaction.amount))}
        </span>
        <button
          onClick={() => onEdit(transaction)}
          className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Edit transaction"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="rounded p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Delete transaction"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
