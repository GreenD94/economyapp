'use client';

import { GoalProgressCard } from './goal.goal-progress-card';
import type { SavingsGoal } from '../types/goal.types';

interface GoalListProps {
  goals: SavingsGoal[];
  isLoading?: boolean;
}

export function GoalList({ goals, isLoading }: GoalListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No savings goals set yet</p>
        <p className="mt-2 text-sm text-gray-400">
          Create goals to track your progress toward financial targets
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalProgressCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
