'use client';
import { useState, useEffect } from 'react';
import { useDashboard }  from './useDashboard.hook';
import { useCountUp }    from '@/features/core/hooks/useCountUp.hook';
import { CAT_COLORS, type PieSlice } from '../dashboard.helpers';

export function useDashboardUI() {
  const { settings, incomes, expenses, loading, error } = useDashboard();

  const [goalOpen, setGoalOpen] = useState(false);
  const [mesOpen,  setMesOpen]  = useState(false);
  const [infoGoal, setInfoGoal] = useState(false);
  const [infoMes,  setInfoMes]  = useState(false);
  const [infoCat,  setInfoCat]  = useState(false);
  const [mounted,  setMounted]  = useState(false);

  const goal     = parseFloat(settings?.goal_amount            ?? '0');
  const current  = parseFloat(settings?.current_savings         ?? '0');
  const target   = parseFloat(settings?.monthly_savings_target  ?? '0');
  const pct      = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  const faltante = goal - current;
  const meses    = target > 0 ? Math.ceil(faltante / target) : 0;

  const totalIncome   = incomes.reduce((s, i) => s + parseFloat(i.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const disponible    = totalIncome - totalExpenses - target;
  const expPct        = totalIncome > 0 ? Math.min(1, totalExpenses / totalIncome) : 0;
  const adjTargetPct  = totalIncome > 0 ? Math.min(target / totalIncome, Math.max(0, 1 - expPct)) : 0;
  const availPct      = totalIncome > 0 ? Math.max(0, 1 - expPct - adjTargetPct) : 0;

  const byCategory: Record<string, number> = {};
  for (const e of expenses) byCategory[e.category] = (byCategory[e.category] ?? 0) + parseFloat(e.amount);
  const totalCatSpend = Object.values(byCategory).reduce((a, b) => a + b, 0);
  const slices: PieSlice[] = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .map(([cat, amount]) => ({ cat, amount, color: CAT_COLORS[cat] ?? '#9e9e9e', pct: amount / totalCatSpend }))
    .sort((a, b) => b.amount - a.amount);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [loading]);

  const countCurrent    = useCountUp(loading ? 0 : current,    2000);
  const countFaltante   = useCountUp(loading ? 0 : faltante,   2000);
  const countDisponible = useCountUp(loading ? 0 : disponible, 2000);

  const heroFillWidth = mounted ? `${pct}%`                : '0%';
  const spendWidth    = mounted ? `${expPct * 100}%`       : '0%';
  const saveWidth     = mounted ? `${adjTargetPct * 100}%` : '0%';
  const availWidth    = mounted ? `${availPct * 100}%`     : '0%';

  return {
    settings, incomes, expenses, loading, error,
    goalOpen, setGoalOpen, mesOpen, setMesOpen,
    infoGoal, setInfoGoal, infoMes, setInfoMes, infoCat, setInfoCat,
    goal, current, target, pct, faltante, meses,
    totalIncome, totalExpenses, disponible,
    expPct, adjTargetPct, availPct,
    slices,
    countCurrent, countFaltante, countDisponible,
    heroFillWidth, spendWidth, saveWidth, availWidth,
  };
}

export type DashboardCtx = ReturnType<typeof useDashboardUI>;
