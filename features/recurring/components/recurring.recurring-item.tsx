'use client';

import { formatCurrency } from '@/features/core/utils';
import { format } from 'date-fns';
import { Calendar, Repeat, Trash2, Edit2, Power } from 'lucide-react';
import type { RecurringTransaction } from '../types/recurring-transaction.types';

interface RecurringItemProps {
  transaction: RecurringTransaction;
  onEdit: (transaction: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function RecurringItem({
  transaction,
  onEdit,
  onDelete,
  onToggle,
}: RecurringItemProps) {
  const isEarning = transaction.type === 'earning';
  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isEarning
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isEarning ? 'Earning' : 'Expense'}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                transaction.isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {transaction.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{transaction.category}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Repeat size={14} />
              <span>{frequencyLabels[transaction.frequency]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Starts: {format(new Date(transaction.startDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <p className={`mt-2 text-lg font-bold ${isEarning ? 'text-green-600' : 'text-red-600'}`}>
            {isEarning ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggle(transaction.id, !transaction.isActive)}
            className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label={transaction.isActive ? 'Deactivate' : 'Activate'}
          >
            <Power size={18} />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
            aria-label="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
