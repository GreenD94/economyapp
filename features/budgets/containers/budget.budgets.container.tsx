'use client';

import { useState } from 'react';
import { BudgetList } from '../components/budget.budget-list';
import { BudgetForm } from '../components/budget.budget-form';
import {
  useCategoryBudgets,
  useCreateCategoryBudget,
  useUpdateCategoryBudget,
  useDeleteCategoryBudget,
} from '../hooks/budget.use-budgets';
import { useCategories } from '../../categories/hooks/category.use-categories';
import type { CategoryBudget } from '../types/budget.types';
import { Plus } from 'lucide-react';

export function BudgetsContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<CategoryBudget | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { data: budgets = [], isLoading } = useCategoryBudgets();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateCategoryBudget();
  const updateMutation = useUpdateCategoryBudget();
  const deleteMutation = useDeleteCategoryBudget();

  const handleAdd = () => {
    setEditingBudget(undefined);
    setSelectedCategoryId(categories[0]?.id || '');
    setIsFormOpen(true);
  };

  const handleEdit = (budget: CategoryBudget) => {
    setEditingBudget(budget);
    setSelectedCategoryId(budget.categoryId);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete budget');
      }
    }
  };

  const handleSubmit = async (
    data: Partial<Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      if (editingBudget) {
        await updateMutation.mutateAsync({
          id: editingBudget.id,
          data,
        });
      } else {
        await createMutation.mutateAsync({
          categoryId: selectedCategoryId,
          monthlyBudget: data.monthlyBudget || 0,
          period: data.period || 'month',
        });
      }
      setIsFormOpen(false);
      setEditingBudget(undefined);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save budget');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingBudget(undefined);
  };

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Category Budgets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set monthly budgets for each category
          </p>
        </div>

        <BudgetList
          budgets={budgets}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-lg">
              <BudgetForm
                initialData={editingBudget}
                categoryName={selectedCategory?.name || ''}
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
          aria-label="Add budget"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
