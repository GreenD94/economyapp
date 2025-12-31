'use client';

import { MonthlyProjection } from '../components/forecasting.monthly-projection';

export function ForecastingContainer() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Expense Forecasting</h1>
          <p className="mt-1 text-sm text-gray-500">
            Project your spending and plan ahead
          </p>
        </div>

        <MonthlyProjection />
      </div>
    </div>
  );
}
