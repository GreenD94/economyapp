'use client';

import { useHealthScore } from '../hooks/health.use-health-score';
import { InfoButton } from '../../help/components/help.info-button';
import { HelpModal } from '../../help/components/help.help-modal';
import { generateHelpContent } from '../../help/utils/help-content-generator';
import { useState } from 'react';
import type { HelpContext } from '../../help/types/help.types';

export function HealthScoreCard() {
  const healthScore = useHealthScore();
  const [helpContext, setHelpContext] = useState<HelpContext | null>(null);

  const getScoreColor = () => {
    if (healthScore.score >= 80) return 'text-green-600';
    if (healthScore.score >= 60) return 'text-blue-600';
    if (healthScore.score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (healthScore.score >= 80) return 'bg-green-100';
    if (healthScore.score >= 60) return 'bg-blue-100';
    if (healthScore.score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = () => {
    if (healthScore.score >= 80) return 'Excellent';
    if (healthScore.score >= 60) return 'Good';
    if (healthScore.score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Financial Health Score</h2>
          <InfoButton
            context="health-score"
            onClick={(ctx) => setHelpContext(ctx)}
          />
        </div>

        <div className="flex items-center justify-center">
          <div className={`relative h-32 w-32 rounded-full ${getScoreBgColor()} flex items-center justify-center`}>
            <div className="text-center">
              <p className={`text-4xl font-bold ${getScoreColor()}`}>
                {healthScore.score.toFixed(0)}
              </p>
              <p className={`text-sm font-medium ${getScoreColor()}`}>
                {getScoreLabel()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Spending Ratio</span>
            <span className="font-medium text-gray-900">
              {healthScore.factors.spendingRatio.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Savings Rate</span>
            <span className="font-medium text-gray-900">
              {healthScore.factors.savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Budget Adherence</span>
            <span className="font-medium text-gray-900">
              {healthScore.factors.budgetAdherence.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trend</span>
            <span className="font-medium text-gray-900">
              {healthScore.factors.trend.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {helpContext && (
        <HelpModal
          content={generateHelpContent(helpContext, { currentValue: healthScore.score })}
          onClose={() => setHelpContext(null)}
        />
      )}
    </>
  );
}
