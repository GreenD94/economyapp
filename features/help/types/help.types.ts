export type HelpContext =
  | 'summary-card-total-spending'
  | 'summary-card-total-earnings'
  | 'summary-card-balance'
  | 'summary-card-monthly-spending'
  | 'summary-card-monthly-earnings'
  | 'summary-card-monthly-balance'
  | 'spending-chart'
  | 'earnings-chart'
  | 'category-pie-chart'
  | 'category-badge'
  | 'budget-progress'
  | 'health-score'
  | 'limit-progress'
  | 'savings-goal';

export interface HelpContent {
  title: string;
  whatIsThis: string;
  currentStatus: string;
  formula?: string;
  examples?: string[];
}
