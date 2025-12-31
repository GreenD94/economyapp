'use client';

import { useState } from 'react';
import { TransactionList } from '../components/transaction.transaction-list';
import { TransactionForm } from '../components/transaction.transaction-form';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/transaction.use-transactions';
import { useCategories } from '../../categories/hooks/category.use-categories';
import type { Transaction } from '../types/transaction.types';
import { Plus } from 'lucide-react';

export function TransactionsContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const categoryNames = categories.map((cat) => cat.name);

  const handleAdd = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  };

  const handleSubmit = async (
    data: Omit<Transaction, 'id' | 'createdAt'>
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
      alert('Failed to save transaction');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your earnings and expenses
          </p>
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {isFormOpen && (
          <TransactionForm
            initialData={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={categoryNames}
          />
        )}

        <button
          onClick={handleAdd}
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add transaction"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
