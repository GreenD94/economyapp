'use client';

import { LimitSettings } from '../components/limit.limit-settings';
import { LimitProgressBar } from '../components/limit.limit-progress-bar';
import { LimitAlertBanner } from '../components/limit.limit-alert-banner';
import { useSpendingLimit, useUpdateSpendingLimit } from '../hooks/limit.use-limits';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { getMonthStart, getMonthEnd } from '@/features/core/utils';
import { useMemo } from 'react';

export function LimitsContainer() {
  const { data: limit, isLoading: isLimitLoading } = useSpendingLimit();
  const updateMutation = useUpdateSpendingLimit();

  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  const { data: transactions = [] } = useTransactions({
    type: 'expense',
    startDate: monthStart,
    endDate: monthEnd,
  });

  const currentSpending = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const handleSubmit = async (
    data: Partial<Omit<typeof limit, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      await updateMutation.mutateAsync(data);
      alert('Spending limit saved successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save limit');
    }
  };

  if (isLimitLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Spending Limits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set and monitor your monthly spending limits
          </p>
        </div>

        {limit && limit.isActive && limit.monthlyLimit > 0 && (
          <div className="mb-6 space-y-4">
            <LimitAlertBanner
              current={currentSpending}
              limit={limit.monthlyLimit}
              thresholds={limit.alertThresholds}
            />
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <LimitProgressBar
                current={currentSpending}
                limit={limit.monthlyLimit}
                thresholds={limit.alertThresholds}
              />
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Configure Limit
          </h2>
          <LimitSettings
            initialData={limit}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
