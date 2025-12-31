'use client';

import { useMonthlyProjection } from '../hooks/forecasting.use-monthly-projection';
import { useSpendingLimit } from '../../limits/hooks/limit.use-limits';
import { formatCurrency } from '@/features/core/utils';

export function MonthlyProjection() {
  const projection = useMonthlyProjection();
  const { data: limit } = useSpendingLimit();

  const isOverLimit = limit && limit.isActive && projection.projectedSpending > limit.monthlyLimit;
  const isOverProjected = projection.projectedSpending > projection.currentSpending;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Monthly Projection</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Spending</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(projection.currentSpending)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Projected Month-End</span>
            <span
              className={`font-semibold ${
                isOverLimit ? 'text-red-600' : isOverProjected ? 'text-orange-600' : 'text-gray-900'
              }`}
            >
              {formatCurrency(projection.projectedSpending)}
            </span>
          </div>
          {limit && limit.isActive && (
            <p className="mt-1 text-xs text-gray-500">
              Limit: {formatCurrency(limit.monthlyLimit)}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily Average</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(projection.dailyAverage)}
            </span>
          </div>
        </div>
        {isOverLimit && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">
              Warning: At current rate, you will exceed your monthly limit by{' '}
              {formatCurrency(projection.projectedSpending - limit.monthlyLimit)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
