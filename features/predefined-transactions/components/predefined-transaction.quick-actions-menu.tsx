'use client';

import { PredefinedTransactionButton } from './predefined-transaction.predefined-transaction-button';
import type { PredefinedTransaction } from '../types/predefined-transaction.types';
import { X } from 'lucide-react';

interface QuickActionsMenuProps {
  transactions: PredefinedTransaction[];
  onSelect: (transaction: PredefinedTransaction) => void;
  onClose: () => void;
}

export function QuickActionsMenu({ transactions, onSelect, onClose }: QuickActionsMenuProps) {
  const handlePredefinedClick = (transaction: PredefinedTransaction) => {
    onSelect(transaction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No predefined transactions available</p>
            <p className="mt-2 text-sm text-gray-400">Run npm run seed to populate predefined transactions</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {transactions.map((transaction) => (
              <PredefinedTransactionButton
                key={transaction.id}
                transaction={transaction}
                onClick={handlePredefinedClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
