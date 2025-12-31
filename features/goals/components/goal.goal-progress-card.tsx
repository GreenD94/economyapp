'use client';

import { formatCurrency } from '@/features/core/utils';
import { format, differenceInDays } from 'date-fns';
import { Target, Calendar } from 'lucide-react';
import type { SavingsGoal } from '../types/goal.types';

interface GoalProgressCardProps {
  goal: SavingsGoal;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="rounded-full p-2"
              style={{ backgroundColor: goal.color + '20' }}
            >
              <Target size={20} style={{ color: goal.color }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
          </div>
          {goal.description && (
            <p className="mt-1 text-sm text-gray-600">{goal.description}</p>
          )}
        </div>
        {isCompleted && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Completed
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: goal.color,
            }}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Current</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Target</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {isCompleted
              ? 'Goal reached!'
              : `${formatCurrency(remaining)} remaining`}
          </p>
          {!isCompleted && daysRemaining > 0 && (
            <p className="text-xs text-gray-500">{daysRemaining} days left</p>
          )}
        </div>
      </div>
    </div>
  );
}
