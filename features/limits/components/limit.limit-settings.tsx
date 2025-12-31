'use client';

import { useState, useEffect } from 'react';
import type { SpendingLimit } from '../types/limit.types';
import { formatCurrency } from '@/features/core/utils';

interface LimitSettingsProps {
  initialData?: SpendingLimit;
  onSubmit: (data: Partial<Omit<SpendingLimit, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  isLoading?: boolean;
}

export function LimitSettings({
  initialData,
  onSubmit,
  isLoading,
}: LimitSettingsProps) {
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [dangerThreshold, setDangerThreshold] = useState(90);
  const [criticalThreshold, setCriticalThreshold] = useState(100);

  useEffect(() => {
    if (initialData) {
      setMonthlyLimit(initialData.monthlyLimit.toString());
      setIsActive(initialData.isActive);
      setWarningThreshold(initialData.alertThresholds.warning);
      setDangerThreshold(initialData.alertThresholds.danger);
      setCriticalThreshold(initialData.alertThresholds.critical);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const limitNumber = parseFloat(monthlyLimit);
    if (isNaN(limitNumber) || limitNumber < 0) {
      return;
    }

    onSubmit({
      monthlyLimit: limitNumber,
      isActive,
      alertThresholds: {
        warning: warningThreshold,
        danger: dangerThreshold,
        critical: criticalThreshold,
      },
    });
  };

  const parsedLimit = parseFloat(monthlyLimit) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Monthly Spending Limit (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="0.00"
            required
          />
        </div>
        {parsedLimit > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {formatCurrency(parsedLimit)} per month
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Enable spending limit alerts
        </label>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Alert Thresholds (Percentage)
        </h3>

        <div>
          <label className="mb-1 block text-xs text-gray-600">
            Warning: {warningThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={warningThreshold}
            onChange={(e) => setWarningThreshold(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">
            Danger: {dangerThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={dangerThreshold}
            onChange={(e) => setDangerThreshold(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">
            Critical: {criticalThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={criticalThreshold}
            onChange={(e) => setCriticalThreshold(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Limit'}
      </button>
    </form>
  );
}
