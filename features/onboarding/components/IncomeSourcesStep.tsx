'use client';
import { Modal } from '@/features/core/components/Modal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DayInput } from '@/features/core/components/DayInput.component';
import modalStyles from '@/features/core/components/Modal.module.css';
import styles from '../styles/Onboarding.module.css';
import {
  FREQ_LABELS, EMPTY_SOURCE, fmtAmt, srcMonthlyEq,
  type IncomeType, type Frequency,
} from '../onboarding.types';
import type { OnboardingCtx } from '../hooks/useOnboarding.hook';

export function IncomeSourcesStep({ ctx }: { ctx: OnboardingCtx }) {
  const {
    incomeSources, monthlyTotal,
    addSourceOpen, setAddSourceOpen,
    editSourceIndex, setEditSourceIndex,
    sourceForm, setSourceForm,
    openAddSource, openEditSource, saveSource, removeSource,
    setStep,
  } = ctx;

  function closeModal() {
    setAddSourceOpen(false); setSourceForm(EMPTY_SOURCE); setEditSourceIndex(null);
  }

  return (
    <>
      <div className={styles.expenseHeader}>
        <span className={styles.question}>¿Cuáles son tus fuentes de ingreso?</span>
      </div>

      {incomeSources.length > 0 ? (
        <div className={styles.sourceList}>
          {incomeSources.map((src, i) => (
            <div key={i} className={styles.sourceRow}>
              <div className={styles.sourceRowLeft}>
                <span className={styles.sourceRowLabel}>{src.label}</span>
                <div className={styles.sourceRowMeta}>
                  <span className={styles.sourceRowPill}>{FREQ_LABELS[src.frequency]}</span>
                  <span className={styles.sourceRowPill}>{src.income_type === 'fixed' ? 'Siempre fijo' : 'Cambia cada mes'}</span>
                </div>
              </div>
              <div className={styles.sourceRowRight}>
                <span className={styles.sourceRowAmt}>
                  {src.income_type === 'fixed' ? `$${fmtAmt(srcMonthlyEq(src))}/mes` : 'Variable'}
                </span>
                <button className={styles.sourceRowEdit} onClick={() => openEditSource(i)} aria-label="Editar">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className={styles.sourceRowRemove} onClick={() => removeSource(i)}>×</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.sourceEmpty}>
          Agrega tus fuentes de ingreso para calcular tu plan de ahorro.
        </p>
      )}

      {monthlyTotal > 0 && (
        <div className={styles.sourceTotal}>
          Total mensual estimado: <strong>${fmtAmt(monthlyTotal)}</strong>
        </div>
      )}

      <button className={styles.addSourceBtn} onClick={openAddSource}>+ Agregar fuente de ingreso</button>
      {incomeSources.length > 0 && (
        <button className={styles.nextBtn} onClick={() => setStep(4)}>Siguiente</button>
      )}
      <button className={styles.volverBtn} onClick={() => setStep(2)}>Volver</button>

      <Modal open={addSourceOpen} onClose={closeModal}
        title={editSourceIndex !== null ? 'Editar fuente de ingreso' : 'Agregar fuente de ingreso'}>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Nombre</label>
          <input className={modalStyles.formInput} placeholder="ej. Salario, Comisiones, Freelance"
            value={sourceForm.label} onChange={e => setSourceForm({ ...sourceForm, label: e.target.value })} autoFocus />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿El monto de esta fuente...?</label>
          <div className={styles.toggleRow}>
            {(['fixed', 'variable'] as IncomeType[]).map(t => (
              <button key={t}
                className={`${styles.toggleOption} ${sourceForm.income_type === t ? styles.toggleOptionActive : ''}`}
                onClick={() => setSourceForm({ ...sourceForm, income_type: t })}>
                {t === 'fixed' ? 'Siempre fijo' : 'Cambia cada mes'}
              </button>
            ))}
          </div>
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cada cuánto lo recibes?</label>
          <div className={styles.toggleRow}>
            {(['weekly', 'biweekly', 'monthly'] as Frequency[]).map(f => (
              <button key={f}
                className={`${styles.toggleOption} ${sourceForm.frequency === f ? styles.toggleOptionActive : ''}`}
                onClick={() => setSourceForm({ ...sourceForm, frequency: f })}>
                {FREQ_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
        {sourceForm.income_type === 'fixed' && (
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>¿Cuánto recibes por pago?</label>
            <MoneyInput fullWidth value={parseFloat(sourceForm.base_amount) || 0}
              onChange={v => setSourceForm({ ...sourceForm, base_amount: String(v) })} />
          </div>
        )}
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Qué día del mes lo recibes?</label>
          <DayInput value={sourceForm.due_day} onChange={d => setSourceForm({ ...sourceForm, due_day: d })} />
        </div>
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={closeModal}>Cancelar</button>
          <button className={modalStyles.submitBtn} onClick={saveSource}
            disabled={!sourceForm.label || (sourceForm.income_type === 'fixed' && !(parseFloat(sourceForm.base_amount) > 0))}>
            {editSourceIndex !== null ? 'Guardar cambios' : 'Agregar'}
          </button>
        </div>
      </Modal>
    </>
  );
}
