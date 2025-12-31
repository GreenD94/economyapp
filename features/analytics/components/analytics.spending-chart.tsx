'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/features/core/utils';
import type { MonthlyData } from '../types/analytics.types';

interface SpendingChartProps {
  data: MonthlyData[];
  type?: 'line' | 'bar';
}

export function SpendingChart({ data, type = 'bar' }: SpendingChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
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
          {type === 'line' && (
            <>
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#ef4444"
                name="Spending"
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                name="Earnings"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
