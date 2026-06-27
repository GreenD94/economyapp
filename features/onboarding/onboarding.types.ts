export type Pace      = 'recomendado' | 'agresivo' | 'personalizado';
export type IncomeType = 'fixed' | 'variable';
export type Frequency  = 'weekly' | 'biweekly' | 'monthly';

export type SourceDraft = {
  label: string; income_type: IncomeType; frequency: Frequency; base_amount: string; due_day: number;
};

export const EMPTY_SOURCE: SourceDraft = {
  label: '', income_type: 'fixed', frequency: 'monthly', base_amount: '', due_day: 15,
};

export const FREQ_LABELS: Record<Frequency, string> = {
  weekly: 'Cada semana', biweekly: 'Cada 15 días', monthly: 'Cada mes',
};

export const FREQ_MULT: Record<Frequency, number> = { weekly: 4.33, biweekly: 2, monthly: 1 };

export const PACES: { key: Pace; label: string; rate: number }[] = [
  { key: 'recomendado', label: 'Recomendado', rate: 0.35 },
  { key: 'agresivo',    label: 'Agresivo',    rate: 0.80 },
];

export const FIXED_EXPENSE_CATEGORIES = [
  { key: 'Arriendo',     label: 'Arriendo / Renta', icon: 'home' },
  { key: 'Electricidad', label: 'Electricidad',      icon: 'bolt' },
  { key: 'Agua',         label: 'Agua',              icon: 'water_drop' },
  { key: 'Gas',          label: 'Gas',               icon: 'local_fire_department' },
  { key: 'Internet',     label: 'Internet',          icon: 'wifi' },
  { key: 'Telefono',     label: 'Teléfono',          icon: 'smartphone' },
  { key: 'Gym',          label: 'Gym',               icon: 'fitness_center' },
];

export const VARIABLE_DEFAULTS = [
  { category: 'Ocio',        monthly_amount: 0   },
  { category: 'Caprichos',   monthly_amount: 0   },
  { category: 'Tecnologia',  monthly_amount: 0   },
  { category: 'Imprevistos', monthly_amount: 100 },
];

export function srcMonthlyEq(src: SourceDraft): number {
  if (src.income_type === 'variable') return 0;
  return (parseFloat(src.base_amount) || 0) * FREQ_MULT[src.frequency];
}

export function fmtAmt(n: number): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
