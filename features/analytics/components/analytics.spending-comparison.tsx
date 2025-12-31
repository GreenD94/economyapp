'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/features/core/utils';
import type { MonthlyData } from '../types/analytics.types';

interface SpendingComparisonProps {
  data: MonthlyData[];
}

export function SpendingComparison({ data }: SpendingComparisonProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value: number | undefined) => `$${(value || 0).toFixed(0)}`} />
          <Tooltip
            formatter={(value: number | undefined) => formatCurrency(value || 0)}
            contentStyle={{ borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="spending" fill="#ef4444" name="Spending" />
          <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
