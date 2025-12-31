'use client';

import { useState } from 'react';
import { TransactionForm } from '../../transactions/components/transaction.transaction-form';
import { useCategories } from '../../categories/hooks/category.use-categories';
import { useCreateTransaction } from '../../transactions/hooks/transaction.use-transactions';
import { Plus, Minus } from 'lucide-react';
import type { Transaction } from '../../transactions/types/transaction.types';

export function DashboardFloatingActions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'earning'>('expense');
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();

  const categoryNames = categories.map((cat) => cat.name);

  const handleQuickAdd = (type: 'expense' | 'earning') => {
    setTransactionType(type);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      await createMutation.mutateAsync(data);
      setIsFormOpen(false);
    } catch (error) {
      alert('Failed to save transaction');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
        <button
          onClick={() => handleQuickAdd('expense')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add expense"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => handleQuickAdd('earning')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add earning"
        >
          <Minus size={24} />
        </button>
      </div>

      {isFormOpen && (
        <TransactionForm
          initialData={{
            id: '',
            type: transactionType,
            amount: 0,
            category: categoryNames[0] || '',
            description: '',
            date: new Date(),
            createdAt: new Date(),
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          categories={categoryNames}
        />
      )}
    </>
  );
}
