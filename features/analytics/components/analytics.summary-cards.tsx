'use client';

import { useState } from 'react';
import { formatCurrency } from '@/features/core/utils';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { InfoButton } from '@/features/help/components/help.info-button';
import { HelpModal } from '@/features/help/components/help.help-modal';
import { generateHelpContent } from '@/features/help/utils/help-content-generator';
import type { SpendingAnalytics } from '../types/analytics.types';
import type { HelpContext } from '@/features/help/types/help.types';

interface SummaryCardsProps {
  analytics: SpendingAnalytics;
}

export function SummaryCards({ analytics }: SummaryCardsProps) {
  const [helpContext, setHelpContext] = useState<HelpContext | null>(null);
  const isPositiveBalance = analytics.monthlyBalance >= 0;
  const balanceColor = isPositiveBalance ? 'text-green-600' : 'text-red-600';
  const balanceIcon = isPositiveBalance ? TrendingUp : TrendingDown;

  const handleHelpClick = (context: HelpContext) => {
    setHelpContext(context);
  };

  const handleCloseHelp = () => {
    setHelpContext(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <InfoButton context="summary-card-total-earnings" onClick={handleHelpClick} />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(analytics.totalEarnings)}
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-3">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <InfoButton context="summary-card-total-spending" onClick={handleHelpClick} />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(analytics.totalSpending)}
            </p>
          </div>
          <div className="rounded-full bg-red-100 p-3">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Monthly Balance</p>
              <InfoButton context="summary-card-monthly-balance" onClick={handleHelpClick} />
            </div>
            <p className={`mt-1 text-2xl font-bold ${balanceColor}`}>
              {formatCurrency(Math.abs(analytics.monthlyBalance))}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {isPositiveBalance ? 'Surplus' : 'Deficit'}
            </p>
          </div>
          <div className={`rounded-full p-3 ${isPositiveBalance ? 'bg-green-100' : 'bg-red-100'}`}>
            {balanceIcon === TrendingUp ? (
              <TrendingUp className="text-green-600" size={24} />
            ) : (
              <TrendingDown className="text-red-600" size={24} />
            )}
          </div>
        </div>
      </div>
      {helpContext && (
        <HelpModal
          content={generateHelpContent(helpContext, { analytics })}
          onClose={handleCloseHelp}
        />
      )}
    </div>
  );
}
