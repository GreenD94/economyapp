'use client';

import { useSpendingComparison } from '../hooks/insights.use-spending-comparison';
import { formatCurrency } from '@/features/core/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function SpendingComparison() {
  const comparison = useSpendingComparison();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Month-over-Month Comparison</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Spending Change</span>
            <div className="flex items-center gap-2">
              {comparison.spendingChange >= 0 ? (
                <TrendingUp className="text-red-600" size={16} />
              ) : (
                <TrendingDown className="text-green-600" size={16} />
              )}
              <span
                className={`font-semibold ${
                  comparison.spendingChange >= 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {comparison.spendingChange >= 0 ? '+' : ''}
                {formatCurrency(comparison.spendingChange)} (
                {comparison.spendingChangePercent >= 0 ? '+' : ''}
                {comparison.spendingChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Earnings Change</span>
            <div className="flex items-center gap-2">
              {comparison.earningsChange >= 0 ? (
                <TrendingUp className="text-green-600" size={16} />
              ) : (
                <TrendingDown className="text-red-600" size={16} />
              )}
              <span
                className={`font-semibold ${
                  comparison.earningsChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {comparison.earningsChange >= 0 ? '+' : ''}
                {formatCurrency(comparison.earningsChange)} (
                {comparison.earningsChangePercent >= 0 ? '+' : ''}
                {comparison.earningsChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Balance Change</span>
            <div className="flex items-center gap-2">
              {comparison.balanceChange >= 0 ? (
                <TrendingUp className="text-green-600" size={16} />
              ) : (
                <TrendingDown className="text-red-600" size={16} />
              )}
              <span
                className={`font-semibold ${
                  comparison.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {comparison.balanceChange >= 0 ? '+' : ''}
                {formatCurrency(comparison.balanceChange)} (
                {comparison.balanceChangePercent >= 0 ? '+' : ''}
                {comparison.balanceChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
