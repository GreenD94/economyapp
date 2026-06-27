'use client';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import styles from '../styles/Onboarding.module.css';
import { PACES } from '../onboarding.types';
import type { OnboardingCtx } from '../hooks/useOnboarding.hook';

export function PlanStep({ ctx }: { ctx: OnboardingCtx }) {
  const {
    available, fixedTotal, hasFixedExpenses,
    selectedPace, setSelectedPace,
    customSavings, setCustomSavings,
    monthlySavings, calcSavings, monthsFor,
    submitting, handleFinish, setStep,
  } = ctx;

  return (
    <>
      <span className={styles.question}>Tu plan de ahorro</span>
      {hasFixedExpenses && (
        <p className={styles.planSummary}>
          Después de tus gastos fijos (${fixedTotal.toLocaleString()}/mes) te quedan{' '}
          <strong>${available.toLocaleString()}</strong> disponibles.
        </p>
      )}
      <div className={styles.paceList}>
        {PACES.map(pace => {
          const monthly  = calcSavings(pace.rate);
          const isSelected = selectedPace === pace.key;
          return (
            <button key={pace.key}
              className={`${styles.pacePill} ${isSelected ? styles.pacePillActive : ''}`}
              onClick={() => setSelectedPace(pace.key)}>
              <span className={styles.paceLabel}>{pace.label}</span>
              <span className={styles.paceDetail}>${monthly.toLocaleString()}/mes · {monthsFor(monthly)} meses</span>
            </button>
          );
        })}
      </div>
      {selectedPace !== 'personalizado' ? (
        <button className={styles.customPaceLink} onClick={() => setSelectedPace('personalizado')}>
          Establecer una cantidad personalizada
        </button>
      ) : (
        <div className={styles.customPaceField}>
          <MoneyInput fullWidth value={customSavings} onChange={setCustomSavings} autoFocus />
          {customSavings > 0 && (
            <p className={styles.customPaceMonths}>
              Llegarás a tu meta en <strong>{monthsFor(customSavings)} meses</strong>
            </p>
          )}
        </div>
      )}
      <p className={styles.planAvailable}>
        Te quedan <strong>${Math.max(0, available - monthlySavings).toLocaleString()}/mes</strong> para gastos variables.
      </p>
      <button className={styles.nextBtn} onClick={handleFinish}
        disabled={submitting || (selectedPace === 'personalizado' && customSavings <= 0)}>
        {submitting ? 'Guardando...' : 'Comenzar'}
      </button>
      <button className={styles.volverBtn} onClick={() => setStep(4)} disabled={submitting}>Volver</button>
    </>
  );
}
