'use client';

import type { Category } from '../types/category.types';

interface CategoryChipProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryChip({ category, size = 'md' }: CategoryChipProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      {category.name}
    </span>
  );
}
