'use client';
import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { InfoModal } from '@/features/core/components/InfoModal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { INFO } from '@/features/core/content/info.content';
import styles from '../styles/Settings.module.css';

export function SettingsContainer() {
  const { settings, loading, saving, saved, error, save } = useSettings();
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [infoKey, setInfoKey] = useState<'goal' | 'income' | 'savingsTarget' | null>(null);

  useEffect(() => {
    if (settings) {
      setGoalAmount(parseFloat(settings.goal_amount).toFixed(0));
      setMonthlyIncome(parseFloat(settings.monthly_income).toFixed(0));
      setMonthlySavings(parseFloat(settings.monthly_savings_target).toFixed(0));
    }
  }, [settings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await save({
      goal_amount: parseFloat(goalAmount),
      monthly_income: parseFloat(monthlyIncome),
      monthly_savings_target: parseFloat(monthlySavings),
    });
  }

  const infoEntry = infoKey ? INFO.onboarding[infoKey] : null;

  if (loading) return <div style={{ padding: 'var(--space-md)', color: 'var(--c-text-muted)' }}>Cargando...</div>;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSave}>
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Objetivos Financieros</span>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>¿Cuánto quieres ahorrar en total?</label>
              <button type="button" className={styles.infoBtn} onClick={() => setInfoKey('goal')}>
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
            <MoneyInput
              fullWidth
              value={parseFloat(goalAmount) || 0}
              onChange={v => setGoalAmount(String(v))}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>¿Cuánto ganas al mes?</label>
              <button type="button" className={styles.infoBtn} onClick={() => setInfoKey('income')}>
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
            <MoneyInput
              fullWidth
              value={parseFloat(monthlyIncome) || 0}
              onChange={v => setMonthlyIncome(String(v))}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>¿Cuánto quieres ahorrar cada mes?</label>
              <button type="button" className={styles.infoBtn} onClick={() => setInfoKey('savingsTarget')}>
                <span className="material-symbols-outlined">info</span>
              </button>
            </div>
            <MoneyInput
              fullWidth
              value={parseFloat(monthlySavings) || 0}
              onChange={v => setMonthlySavings(String(v))}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {saved && <p className={styles.savedMsg}>Guardado correctamente</p>}

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {infoEntry && (
        <InfoModal
          open={infoKey !== null}
          onClose={() => setInfoKey(null)}
          title={infoEntry.title}
          howItWorks={<>{infoEntry.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>}
          glossary={infoEntry.glossary}
        />
      )}
    </div>
  );
}
