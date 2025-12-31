'use client';

'use client';

import { useState, useMemo } from 'react';
import { SummaryCards } from '../components/analytics.summary-cards';
import { SpendingChart } from '../components/analytics.spending-chart';
import { CategoryPieChart } from '../components/analytics.category-pie-chart';
import { EarningsChart } from '../components/analytics.earnings-chart';
import { useSpendingAnalytics } from '../hooks/analytics.use-spending-analytics';
import { useCategoryBreakdown } from '../hooks/analytics.use-category-breakdown';
import { useEarningsAnalytics } from '../hooks/analytics.use-earnings-analytics';
import { LimitAlertBanner } from '../../limits/components/limit.limit-alert-banner';
import { useSpendingLimit } from '../../limits/hooks/limit.use-limits';
import { useTransactions } from '../../transactions/hooks/transaction.use-transactions';
import { QuickActionsButton } from '../../predefined-transactions/components/predefined-transaction.quick-actions-button';
import { QuickActionsMenu } from '../../predefined-transactions/components/predefined-transaction.quick-actions-menu';
import { usePredefinedTransactions, useExecutePredefinedTransaction } from '../../predefined-transactions/hooks/predefined-transaction.use-predefined-transactions';
import { TransactionForm } from '../../transactions/components/transaction.transaction-form';
import { useCreateTransaction } from '../../transactions/hooks/transaction.use-transactions';
import { useCategories } from '../../categories/hooks/category.use-categories';
import { HealthScoreCard } from '../../health/components/health.health-score-card';
import { getMonthStart, getMonthEnd } from '@/features/core/utils';
import { Plus, Minus } from 'lucide-react';
import { InfoButton } from '@/features/help/components/help.info-button';
import { HelpModal } from '@/features/help/components/help.help-modal';
import { generateHelpContent } from '@/features/help/utils/help-content-generator';
import type { PredefinedTransaction } from '../../predefined-transactions/types/predefined-transaction.types';
import type { Transaction } from '../../transactions/types/transaction.types';
import type { HelpContext } from '@/features/help/types/help.types';

export function DashboardContainer() {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'earning'>('expense');
  const [helpContext, setHelpContext] = useState<HelpContext | null>(null);

  const analytics = useSpendingAnalytics();
  const categoryBreakdown = useCategoryBreakdown();
  const monthlyData = useEarningsAnalytics(6);
  const { data: limit } = useSpendingLimit();
  const { data: predefinedTransactions = [] } = usePredefinedTransactions();
  const executePredefined = useExecutePredefinedTransaction();
  const createTransaction = useCreateTransaction();
  const { data: categories = [] } = useCategories();

  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  const { data: transactions = [], refetch: refetchTransactions } = useTransactions({
    type: 'expense',
    startDate: monthStart,
    endDate: monthEnd,
  });

  const currentSpending = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const showLimitAlert = limit && limit.isActive && limit.monthlyLimit > 0;

  const categoryNames = categories.map((cat) => cat.name);

  const handleQuickAction = async (predefined: PredefinedTransaction) => {
    try {
      if (predefined.amount > 0) {
        await executePredefined.mutateAsync({
          id: predefined.id,
        });
        setIsQuickActionsOpen(false);
        await refetchTransactions();
      } else {
        setIsTransactionFormOpen(true);
        setTransactionType(predefined.type);
      }
    } catch (error) {
      alert('Failed to execute transaction');
    }
  };

  const handleQuickAdd = (type: 'expense' | 'earning') => {
    setTransactionType(type);
    setIsTransactionFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your finances
          </p>
        </div>

        {showLimitAlert && (
          <div className="mb-6">
            <LimitAlertBanner
              current={currentSpending}
              limit={limit.monthlyLimit}
              thresholds={limit.alertThresholds}
            />
          </div>
        )}

        <div className="mb-6">
          <SummaryCards analytics={analytics} />
        </div>

        <div className="mb-6">
          <HealthScoreCard />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Spending & Earnings Trend
              </h2>
              <InfoButton
                context="spending-chart"
                onClick={(ctx) => setHelpContext(ctx)}
              />
            </div>
            <SpendingChart data={monthlyData} type="bar" />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Spending by Category
              </h2>
              <InfoButton
                context="category-pie-chart"
                onClick={(ctx) => setHelpContext(ctx)}
              />
            </div>
            <CategoryPieChart data={categoryBreakdown} />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Earnings & Spending Over Time
            </h2>
            <InfoButton
              context="earnings-chart"
              onClick={(ctx) => setHelpContext(ctx)}
            />
          </div>
          <EarningsChart data={monthlyData} />
        </div>
      </div>

      <div className="fixed bottom-24 left-4 z-40 flex flex-col gap-3">
        <button
          onClick={() => handleQuickAdd('expense')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add expense"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => handleQuickAdd('earning')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform active:scale-95 touch-manipulation"
          aria-label="Add earning"
        >
          <Minus size={24} />
        </button>
      </div>

      <QuickActionsButton onClick={() => setIsQuickActionsOpen(true)} />

      {isQuickActionsOpen && (
        <QuickActionsMenu
          transactions={predefinedTransactions}
          onSelect={handleQuickAction}
          onClose={() => setIsQuickActionsOpen(false)}
        />
      )}

      {isTransactionFormOpen && (
        <TransactionForm
          initialData={undefined}
          defaultType={transactionType}
          onSubmit={async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
            try {
              await createTransaction.mutateAsync(data);
              setIsTransactionFormOpen(false);
              await refetchTransactions();
            } catch (error) {
              alert('Failed to save transaction');
            }
          }}
          onCancel={() => setIsTransactionFormOpen(false)}
          categories={categoryNames}
        />
      )}

      {helpContext && (
        <HelpModal
          content={generateHelpContent(helpContext, {
            analytics,
            categoryBreakdown,
          })}
          onClose={() => setHelpContext(null)}
        />
      )}
    </div>
  );
}
