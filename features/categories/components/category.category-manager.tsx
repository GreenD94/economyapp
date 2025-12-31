'use client';

import { useState } from 'react';
import type { Category } from '../types/category.types';
import { CategoryChip } from './category.category-chip';
import { Trash2, Edit2 } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function CategoryManager({
  categories,
  onEdit,
  onDelete,
  isLoading,
}: CategoryManagerProps) {
  const customCategories = categories.filter((cat) => !cat.isPredefined);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Predefined Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((cat) => cat.isPredefined)
            .map((category) => (
              <CategoryChip key={category.id} category={category} />
            ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Custom Categories
        </h3>
        {customCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No custom categories yet</p>
        ) : (
          <div className="space-y-2">
            {customCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <CategoryChip category={category} />
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Edit category"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="rounded p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
