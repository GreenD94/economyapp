'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/features/core/utils';
import type { MonthlyData } from '../types/analytics.types';

interface EarningsChartProps {
  data: MonthlyData[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value: number | undefined) => `$${(value || 0).toFixed(0)}`} />
          <Tooltip
            formatter={(value: number | undefined) => formatCurrency(value || 0)}
            contentStyle={{ borderRadius: '8px' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#10b981"
            strokeWidth={2}
            name="Earnings"
          />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#ef4444"
            strokeWidth={2}
            name="Spending"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
