'use client';

import { useState } from 'react';
import { RecurringList } from '../components/recurring.recurring-list';
import { RecurringForm } from '../components/recurring.recurring-form';
import {
  useRecurringTransactions,
  useCreateRecurringTransaction,
  useUpdateRecurringTransaction,
  useDeleteRecurringTransaction,
  useProcessRecurringTransactions,
} from '../hooks/recurring.use-recurring-transactions';
import { useCategories } from '../../categories/hooks/category.use-categories';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import { Plus, Play } from 'lucide-react';

export function RecurringContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | undefined>(undefined);

  const { data: transactions = [], isLoading } = useRecurringTransactions();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateRecurringTransaction();
  const updateMutation = useUpdateRecurringTransaction();
  const deleteMutation = useDeleteRecurringTransaction();
  const processMutation = useProcessRecurringTransactions();

  const categoryNames = categories.map((cat) => cat.name);

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete recurring transaction');
      }
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { isActive } });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update recurring transaction');
    }
  };

  const handleProcess = async () => {
    try {
      const count = await processMutation.mutateAsync();
      alert(`Processed ${count} recurring transactions`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process recurring transactions');
    }
  };

  const handleSubmit = async (
    data: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({
          id: editingTransaction.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingTransaction(undefined);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save recurring transaction');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recurring Transactions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage automatic transactions for bills and income
            </p>
          </div>
          <button
            onClick={handleProcess}
            disabled={processMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors active:bg-green-700 disabled:opacity-50"
          >
            <Play size={18} />
            Process
          </button>
        </div>

        <RecurringList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
          isLoading={isLoading}
        />

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-lg">
              <RecurringForm
                initialData={editingTransaction}
                categories={categoryNames}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add recurring transaction"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
