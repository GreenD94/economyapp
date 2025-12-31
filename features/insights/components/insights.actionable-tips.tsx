'use client';

import { useSpendingAnalytics } from '../../analytics/hooks/analytics.use-spending-analytics';
import { useCategoryBreakdown } from '../../analytics/hooks/analytics.use-category-breakdown';
import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';

export function ActionableTips() {
  const analytics = useSpendingAnalytics();
  const categoryBreakdown = useCategoryBreakdown();

  const tips = useMemo(() => {
    const tipsList: string[] = [];

    if (analytics.monthlySpending > analytics.monthlyEarnings) {
      tipsList.push(
        'Your spending exceeds your earnings. Consider reducing expenses or increasing income.'
      );
    }

    if (analytics.monthlyBalance < 0) {
      tipsList.push(
        `You have a monthly deficit of ${Math.abs(analytics.monthlyBalance).toFixed(2)}. Try to reduce spending by at least this amount.`
      );
    }

    if (categoryBreakdown.length > 0) {
      const largestCategory = categoryBreakdown[0];
      if (largestCategory) {
        tipsList.push(
          `Your largest expense category is ${largestCategory.category}. Consider reviewing spending in this area.`
        );
      }
    }

    if (analytics.monthlyBalance > 0 && analytics.monthlyBalance < analytics.monthlyEarnings * 0.1) {
      tipsList.push(
        'You are saving, but less than 10% of your income. Aim to save at least 20% for better financial health.'
      );
    }

    if (tipsList.length === 0) {
      tipsList.push('Great job! Your finances are in good shape. Keep up the good work!');
    }

    return tipsList;
  }, [analytics, categoryBreakdown]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Actionable Tips</h3>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-1 text-yellow-500">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
