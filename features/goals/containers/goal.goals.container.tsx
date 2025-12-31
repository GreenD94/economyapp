'use client';

import { useState } from 'react';
import { GoalList } from '../components/goal.goal-list';
import { GoalForm } from '../components/goal.goal-form';
import {
  useSavingsGoals,
  useCreateSavingsGoal,
  useUpdateSavingsGoal,
  useDeleteSavingsGoal,
} from '../hooks/goal.use-goals';
import type { SavingsGoal } from '../types/goal.types';
import { Plus } from 'lucide-react';

export function GoalsContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(undefined);

  const { data: goals = [], isLoading } = useSavingsGoals();
  const createMutation = useCreateSavingsGoal();
  const updateMutation = useUpdateSavingsGoal();
  const deleteMutation = useDeleteSavingsGoal();

  const handleAdd = () => {
    setEditingGoal(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete goal');
      }
    }
  };

  const handleSubmit = async (
    data: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (editingGoal) {
        await updateMutation.mutateAsync({
          id: editingGoal.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingGoal(undefined);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save goal');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGoal(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set and track your financial goals
          </p>
        </div>

        <GoalList goals={goals} isLoading={isLoading} />

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-lg">
              <GoalForm
                initialData={editingGoal}
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
          aria-label="Add goal"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
