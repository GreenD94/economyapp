export interface SpendingAnalytics {
  totalSpending: number;
  totalEarnings: number;
  balance: number;
  monthlySpending: number;
  monthlyEarnings: number;
  monthlyBalance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  spending: number;
  earnings: number;
  balance: number;
}
