'use client';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import styles from '../styles/Onboarding.module.css';
import type { OnboardingCtx } from '../hooks/useOnboarding.hook';

export function SavingsStep({ ctx }: { ctx: OnboardingCtx }) {
  const { currentSavings, setCurrentSavings, setStep } = ctx;
  return (
    <>
      <span className={styles.question}>¿Cuánto tienes ahorrado hoy?</span>
      <MoneyInput fullWidth value={currentSavings} onChange={setCurrentSavings} autoFocus />
      <button className={styles.nextBtn} onClick={() => setStep(3)}>Siguiente</button>
      <button className={styles.volverBtn} onClick={() => setStep(1)}>Volver</button>
    </>
  );
}
