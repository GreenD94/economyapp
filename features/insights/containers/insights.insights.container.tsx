'use client';

import { SpendingComparison } from '../components/insights.spending-comparison';
import { ActionableTips } from '../components/insights.actionable-tips';

export function InsightsContainer() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Financial Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze your spending patterns and get personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SpendingComparison />
          <ActionableTips />
        </div>
      </div>
    </div>
  );
}
