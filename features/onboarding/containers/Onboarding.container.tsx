'use client';
import { InfoModal } from '@/features/core/components/InfoModal.component';
import styles from '../styles/Onboarding.module.css';
import { useOnboarding, TOTAL_STEPS } from '../hooks/useOnboarding.hook';
import { GoalStep }          from '../components/GoalStep';
import { SavingsStep }       from '../components/SavingsStep';
import { IncomeSourcesStep } from '../components/IncomeSourcesStep';
import { ExpensesStep }      from '../components/ExpensesStep';
import { PlanStep }          from '../components/PlanStep';

export function OnboardingContainer() {
  const ctx = useOnboarding();
  const { step, infoOpen, setInfoOpen, infoEntry } = ctx;

  return (
    <div className={`${styles.page} ${styles[`step${step}`]}`}>

      <div className={styles.topBar}>
        <div className={styles.topBarSpacer} />
        <div className={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`${styles.dot} ${i + 1 === step ? styles.dotActive : ''}`} />
          ))}
        </div>
        <button className={styles.infoBtn} onClick={() => setInfoOpen(true)} aria-label="Más información">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>

      <div className={`${styles.body} ${(step === 3 || step === 4) ? styles.bodyExpenses : ''}`}>
        <div className={styles.group}>
          {step === 1 && <GoalStep          ctx={ctx} />}
          {step === 2 && <SavingsStep       ctx={ctx} />}
          {step === 3 && <IncomeSourcesStep ctx={ctx} />}
          {step === 4 && <ExpensesStep      ctx={ctx} />}
          {step === 5 && <PlanStep          ctx={ctx} />}
        </div>
      </div>

      {infoEntry && (
        <InfoModal
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          title={infoEntry.title}
          howItWorks={<>{infoEntry.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>}
          glossary={infoEntry.glossary}
        />
      )}
    </div>
  );
}
