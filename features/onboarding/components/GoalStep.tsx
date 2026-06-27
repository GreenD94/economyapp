'use client';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import styles from '../styles/Onboarding.module.css';
import type { OnboardingCtx } from '../hooks/useOnboarding.hook';

export function GoalStep({ ctx }: { ctx: OnboardingCtx }) {
  const { goalAmount, setGoalAmount, setStep } = ctx;
  return (
    <>
      <span className={styles.question}>¿Cuánto quieres ahorrar en total?</span>
      <MoneyInput fullWidth value={parseFloat(goalAmount) || 0} onChange={v => setGoalAmount(String(v))} autoFocus />
      <button className={styles.nextBtn} onClick={() => setStep(2)} disabled={!(parseFloat(goalAmount) > 0)}>
        Siguiente
      </button>
    </>
  );
}
