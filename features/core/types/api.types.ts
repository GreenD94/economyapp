export type SettingsFromAPI = {
  goal_amount: string;
  monthly_savings_target: string;
  monthly_income: string;
  current_savings: string;
  updated_at: string | null;
};

export type IncomeFromAPI = {
  id: number;
  source_id: number | null;
  date: string;
  source: string;
  amount: string;
  type: string;
  notes: string | null;
  created_at: string;
};

export type IncomeSourceFromAPI = {
  id: number;
  label: string;
  income_type: 'fixed' | 'variable';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  base_amount: string | null;
  due_day: number;
  is_active: boolean;
  monthly_equivalent: string;
  created_at: string;
};

export type ExpenseFromAPI = {
  id: number;
  source_id: number | null;
  date: string;
  category: string;
  description: string;
  amount: string;
  type: string;
  created_at: string;
};

export type ExpenseSourceFromAPI = {
  id: number;
  label: string;
  category: string;
  classification: string;
  expense_type: 'fixed' | 'variable';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  base_amount: string | null;
  due_day: number;
  is_active: boolean;
  monthly_equivalent: string;
  created_at: string;
};

export type BudgetFromAPI = {
  category: string;
  monthly_amount: string;
  due_day: number;
  spent_this_month: string;
  remaining: string;
};

export type WishlistItemFromAPI = {
  id: number;
  item: string;
  price: string;
  priority: string;
  status: string;
  notes: string | null;
  days_waiting: number;
  verdict: string;
  created_at: string;
};

export type NetWorthEntryFromAPI = {
  id: number | null;
  month: string;
  amount: string;
  growth: string | null;
  is_actual: boolean;
  goal_reached: boolean;
};
