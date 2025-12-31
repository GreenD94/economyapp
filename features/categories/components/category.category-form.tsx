'use client';

import { useState, useEffect } from 'react';
import type { Category } from '../types/category.types';
import { X } from 'lucide-react';

const CATEGORY_ICONS = [
  'tag',
  'shopping-bag',
  'utensils',
  'car',
  'home',
  'heart',
  'book',
  'film',
  'gamepad-2',
  'dumbbell',
  'briefcase',
  'gift',
  'coffee',
  'plane',
  'music',
];

const CATEGORY_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#84cc16',
  '#06b6d4',
  '#a855f7',
  '#e11d48',
  '#0ea5e9',
  '#64748b',
];

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState('#6b7280');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
      setColor(initialData.color);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      icon,
      color,
      isPredefined: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORY_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`rounded-lg border-2 p-2 text-center text-xs transition-colors touch-manipulation ${
                    icon === iconName
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white active:bg-gray-50'
                  }`}
                >
                  {iconName}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORY_COLORS.map((colorValue) => (
                <button
                  key={colorValue}
                  type="button"
                  onClick={() => setColor(colorValue)}
                  className={`h-10 w-full rounded-lg border-2 transition-transform touch-manipulation ${
                    color === colorValue
                      ? 'scale-110 border-gray-900 ring-2 ring-offset-2'
                      : 'border-gray-200 active:scale-95'
                  }`}
                  style={{ backgroundColor: colorValue }}
                  aria-label={`Select color ${colorValue}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors active:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors active:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
