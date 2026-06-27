'use client';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DayInput } from '@/features/core/components/DayInput.component';
import styles from '../styles/Onboarding.module.css';
import { FIXED_EXPENSE_CATEGORIES } from '../onboarding.types';
import type { OnboardingCtx } from '../hooks/useOnboarding.hook';

export function ExpensesStep({ ctx }: { ctx: OnboardingCtx }) {
  const { fixedExpenses, updateExpense, updateExpenseDueDay, setStep } = ctx;
  return (
    <>
      <div className={styles.expenseHeader}>
        <span className={styles.question}>¿Cuánto gastas al mes en esto?</span>
        <span className={styles.expenseSubtitle}>Solo los que pagas igual todos los meses.</span>
      </div>
      <div className={styles.expenseList}>
        {FIXED_EXPENSE_CATEGORIES.map((cat, index) => (
          <div key={cat.key} className={styles.expenseRow}>
            <span className={`${styles.expenseCatIcon} material-symbols-outlined`}>{cat.icon}</span>
            <span className={styles.expenseLabel}>{cat.label}</span>
            <MoneyInput compact value={parseFloat(fixedExpenses[index].amount) || 0}
              onChange={v => updateExpense(index, String(v))} />
            <DayInput value={fixedExpenses[index].due_day} onChange={d => updateExpenseDueDay(index, d)} />
          </div>
        ))}
      </div>
      <button className={styles.nextBtn} onClick={() => setStep(5)}>Siguiente</button>
      <button className={styles.volverBtn} onClick={() => setStep(3)}>Volver</button>
      <button className={styles.skipLink} onClick={() => setStep(5)}>Omitir este paso</button>
    </>
  );
}
