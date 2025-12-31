'use client';

import type { Category } from '../types/category.types';
import { CategoryChip } from './category.category-chip';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`transition-transform hover:scale-105 ${
              isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
          >
            <CategoryChip category={category} />
          </button>
        );
      })}
    </div>
  );
}
