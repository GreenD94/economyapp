'use client';

import { formatCurrency } from '@/features/core/utils';

interface LimitProgressBarProps {
  current: number;
  limit: number;
  thresholds: {
    warning: number;
    danger: number;
    critical: number;
  };
}

export function LimitProgressBar({
  current,
  limit,
  thresholds,
}: LimitProgressBarProps) {
  if (limit === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-500">
        No spending limit set
      </div>
    );
  }

  const percentage = Math.min((current / limit) * 100, 100);
  const isWarning = percentage >= thresholds.warning && percentage < thresholds.danger;
  const isDanger = percentage >= thresholds.danger && percentage < thresholds.critical;
  const isCritical = percentage >= thresholds.critical;

  const getColorClasses = () => {
    if (isCritical) return 'bg-red-600';
    if (isDanger) return 'bg-orange-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (isCritical) return 'text-red-700';
    if (isDanger) return 'text-orange-700';
    if (isWarning) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Monthly Spending</span>
        <span className={`font-semibold ${getTextColor()}`}>
          {formatCurrency(current)} / {formatCurrency(limit)}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-center">
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {percentage.toFixed(1)}% of limit
        </span>
      </div>
    </div>
  );
}
