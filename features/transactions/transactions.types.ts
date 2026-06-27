import type { IncomeFromAPI, IncomeSourceFromAPI, ExpenseFromAPI, ExpenseSourceFromAPI } from '@/features/core/types/api.types';

export type Tab        = 'incomes' | 'expenses';
export type IncomeType = 'fixed' | 'variable';
export type Frequency  = 'weekly' | 'biweekly' | 'monthly';

export type IncomeForm  = { date: string; source: string; amount: string; type: string };
export type ExpenseForm = { date: string; category: string; description: string; amount: string; type: string };
export type SourceForm  = { label: string; income_type: IncomeType; frequency: Frequency; base_amount: string; due_day: number; note: string };

export function nowISO() { return new Date().toISOString(); }

export function fmtAmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' });
}

export const FREQ_LABELS: Record<Frequency, string> = {
  weekly: 'Cada semana',
  biweekly: 'Cada 15 días',
  monthly: 'Cada mes',
};

export const EMPTY_INCOME:  IncomeForm  = { date: nowISO(), source: '', amount: '', type: 'Extra' };
export const EMPTY_EXPENSE: ExpenseForm = { date: nowISO(), category: 'Alimentacion', description: '', amount: '', type: 'Necesidad' };
export const EMPTY_SOURCE:  SourceForm  = { label: '', income_type: 'fixed', frequency: 'monthly', base_amount: '', due_day: 15, note: '' };

export type ConfirmSrcState        = { source: IncomeSourceFromAPI;  amount: string; date: string; slotIndex: number; totalSlots: number };
export type ConfirmExpenseSrcState = { source: ExpenseSourceFromAPI; amount: string; date: string; slotIndex: number; totalSlots: number };
export type ConfirmState           = { msg: string; action: () => void };
export type UnconfirmState         = { entry: IncomeFromAPI;  source: IncomeSourceFromAPI;  note: string; slotIndex: number; totalSlots: number };
export type UnconfirmExpenseState  = { entry: ExpenseFromAPI; source: ExpenseSourceFromAPI; note: string; slotIndex: number; totalSlots: number };

export type ExpenseSourceForm = {
  label:          string;
  category:       string;
  classification: string;
  expense_type:   string;
  frequency:      string;
  base_amount:    string;
  due_day:        number;
  note:           string;
};

export const EMPTY_EXPENSE_SOURCE: ExpenseSourceForm = {
  label:          '',
  category:       '',
  classification: '',
  expense_type:   'variable',
  frequency:      'monthly',
  base_amount:    '',
  due_day:        1,
  note:           '',
};
