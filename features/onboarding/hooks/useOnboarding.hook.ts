'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/features/core/utils/api.client';
import { INFO } from '@/features/core/content/info.content';
import {
  EMPTY_SOURCE, FIXED_EXPENSE_CATEGORIES, VARIABLE_DEFAULTS, PACES,
  srcMonthlyEq, type Pace, type SourceDraft,
} from '../onboarding.types';

export const TOTAL_STEPS = 5;

export function useOnboarding() {
  const [step, setStep]               = useState(1);
  const [goalAmount, setGoalAmount]   = useState('15000');
  const [incomeSources, setIncomeSources] = useState<SourceDraft[]>([]);
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [editSourceIndex, setEditSourceIndex] = useState<number | null>(null);
  const [sourceForm, setSourceForm]   = useState<SourceDraft>(EMPTY_SOURCE);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(
    FIXED_EXPENSE_CATEGORIES.map(c => ({ category: c.key, amount: '', due_day: 1 }))
  );
  const [selectedPace, setSelectedPace] = useState<Pace>('recomendado');
  const [customSavings, setCustomSavings] = useState(0);
  const [infoOpen, setInfoOpen]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const router = useRouter();

  const monthlyTotal    = incomeSources.reduce((s, src) => s + srcMonthlyEq(src), 0);
  const fixedTotal      = fixedExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const available       = Math.max(1, monthlyTotal - fixedTotal);
  const hasFixedExpenses = fixedTotal > 0;

  function calcSavings(rate: number) { return Math.round(available * rate); }
  function monthsFor(savings: number) {
    if (savings <= 0) return 999;
    return Math.ceil(parseFloat(goalAmount || '0') / savings);
  }
  const monthlySavings = selectedPace === 'personalizado'
    ? customSavings
    : calcSavings(PACES.find(p => p.key === selectedPace)!.rate);

  function updateExpense(index: number, amount: string) {
    setFixedExpenses(prev => prev.map((e, i) => i === index ? { ...e, amount } : e));
  }
  function updateExpenseDueDay(index: number, due_day: number) {
    setFixedExpenses(prev => prev.map((e, i) => i === index ? { ...e, due_day } : e));
  }
  function openAddSource() {
    setEditSourceIndex(null); setSourceForm(EMPTY_SOURCE); setAddSourceOpen(true);
  }
  function openEditSource(index: number) {
    setEditSourceIndex(index); setSourceForm({ ...incomeSources[index] }); setAddSourceOpen(true);
  }
  function saveSource() {
    if (!sourceForm.label) return;
    if (editSourceIndex !== null) {
      setIncomeSources(prev => prev.map((s, i) => i === editSourceIndex ? { ...sourceForm } : s));
    } else {
      setIncomeSources(prev => [...prev, { ...sourceForm }]);
    }
    setSourceForm(EMPTY_SOURCE); setEditSourceIndex(null); setAddSourceOpen(false);
  }
  function removeSource(index: number) {
    setIncomeSources(prev => prev.filter((_, i) => i !== index));
  }
  async function handleFinish() {
    setSubmitting(true);
    try {
      for (const src of incomeSources) {
        await apiPost('/api/v1/income-sources', {
          label: src.label, income_type: src.income_type, frequency: src.frequency,
          base_amount: src.income_type === 'fixed' ? (parseFloat(src.base_amount) || 0) : null,
          due_day: src.due_day,
        });
      }
      await apiPost('/api/v1/settings', {
        goal_amount: parseFloat(goalAmount), monthly_income: monthlyTotal,
        monthly_savings_target: monthlySavings, current_savings: currentSavings,
      });
      for (const expense of fixedExpenses) {
        const amount = parseFloat(expense.amount) || 0;
        if (amount > 0) {
          await apiPost('/api/v1/budgets', { category: expense.category, monthly_amount: amount, due_day: expense.due_day });
          await apiPost('/api/v1/expense-sources', {
            label: expense.category, category: expense.category,
            classification: 'Necesidad', expense_type: 'fixed',
            frequency: 'monthly', base_amount: amount, due_day: expense.due_day,
          });
        }
      }
      for (const cat of VARIABLE_DEFAULTS) await apiPost('/api/v1/budgets', cat);
      router.push('/');
    } catch { router.push('/'); }
    finally { setSubmitting(false); }
  }

  const infoEntry = [
    INFO.onboarding.goal, INFO.onboarding.goal, INFO.onboarding.income,
    INFO.onboarding.fixedExpenses, INFO.onboarding.plan,
  ][step - 1];

  return {
    step, setStep, goalAmount, setGoalAmount,
    incomeSources, addSourceOpen, setAddSourceOpen,
    editSourceIndex, setEditSourceIndex, sourceForm, setSourceForm,
    currentSavings, setCurrentSavings, fixedExpenses,
    selectedPace, setSelectedPace, customSavings, setCustomSavings,
    infoOpen, setInfoOpen, submitting,
    monthlyTotal, fixedTotal, available, hasFixedExpenses, monthlySavings,
    calcSavings, monthsFor,
    updateExpense, updateExpenseDueDay,
    openAddSource, openEditSource, saveSource, removeSource,
    handleFinish, infoEntry,
  };
}

export type OnboardingCtx = ReturnType<typeof useOnboarding>;
