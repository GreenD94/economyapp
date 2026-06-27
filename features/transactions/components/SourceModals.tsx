'use client';
import { Modal } from '@/features/core/components/Modal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DayInput } from '@/features/core/components/DayInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { NoteInput } from '@/features/core/components/NoteInput.component';
import modalStyles from '@/features/core/components/Modal.module.css';
import styles from '../styles/Transactions.module.css';
import { nowISO, EMPTY_SOURCE, FREQ_LABELS, fmtAmt, type IncomeType, type Frequency } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

export function SourceModals({ ctx }: { ctx: TransactionCtx }) {
  const {
    unconfirmModal, setUnconfirmModal, submitUnconfirm,
    confirmSrcModal, setConfirmSrcModal, submitConfirmSrc,
    addSourceOpen, setAddSourceOpen, sourceForm, setSourceForm, handleAddSource,
    editSourceModal, setEditSourceModal, editSourceForm, setEditSourceForm, submitEditSource,
    setConfirm,
  } = ctx;

  return (
    <>
      <Modal open={unconfirmModal !== null} onClose={() => setUnconfirmModal(null)} title="Quitar confirmación" variant="earn">
        {unconfirmModal && (
          <div className={modalStyles.modalSubRow}>
            <span className={modalStyles.modalSubDate}>
              Pago {unconfirmModal.slotIndex}/{unconfirmModal.totalSlots}
              {' · '}
              {new Date(unconfirmModal.entry.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className={modalStyles.modalSubAmount}>${fmtAmt(parseFloat(unconfirmModal.entry.amount))}</span>
          </div>
        )}
        <p className={modalStyles.modalHeading}>{unconfirmModal?.source.label}</p>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Por qué quitas esta confirmación? <span style={{ color: 'var(--c-red-border)' }}>*</span></label>
          <textarea
            className={modalStyles.formInput}
            style={{ minHeight: 80, resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
            maxLength={500}
            placeholder="Ej: el pago no se realizó, hubo un error al confirmar..."
            value={unconfirmModal?.note ?? ''}
            onChange={e => setUnconfirmModal(m => m ? { ...m, note: e.target.value } : m)}
          />
        </div>
        <div className={modalStyles.formActions}>
          {(unconfirmModal?.note.trim().split(/\s+/).filter(Boolean).length ?? 0) >= 2 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.confirmDanger}`} onClick={submitUnconfirm}>
              Quitar confirmación
            </button>
          )}
        </div>
      </Modal>

      <Modal open={confirmSrcModal !== null} onClose={() => setConfirmSrcModal(null)}
        title={confirmSrcModal?.source.income_type === 'fixed' ? `Confirmar: ${confirmSrcModal?.source.label}` : `Ingreso de ${confirmSrcModal?.source.label ?? ''}`}
        variant="earn">
        {confirmSrcModal && (
          <div className={modalStyles.modalSubRow}>
            <span className={modalStyles.modalSubDate}>
              Pago {confirmSrcModal.slotIndex}/{confirmSrcModal.totalSlots}
            </span>
          </div>
        )}
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo lo recibiste?" variant="earn" value={confirmSrcModal?.date ?? nowISO()}
            onChange={iso => setConfirmSrcModal(m => m ? { ...m, date: iso } : m)} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto recibiste?</label>
          <MoneyInput fullWidth variant="earn" value={parseFloat(confirmSrcModal?.amount ?? '') || 0}
            onChange={v => setConfirmSrcModal(m => m ? { ...m, amount: String(v) } : m)} />
        </div>
        <div className={modalStyles.formActions}>
          {parseFloat(confirmSrcModal?.amount ?? '') > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnEarn}`} onClick={submitConfirmSrc}>Confirmar ingreso</button>
          )}
        </div>
      </Modal>

      <Modal open={addSourceOpen} onClose={() => { setAddSourceOpen(false); setSourceForm(EMPTY_SOURCE); }} title="Agregar fuente de ingreso" variant="earn">
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Nombre</label>
          <input className={modalStyles.formInput} placeholder="ej. Salario, Comisiones" maxLength={150}
            value={sourceForm.label} onChange={e => setSourceForm({ ...sourceForm, label: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿El monto de esta fuente...?</label>
          <div className={styles.toggleRow}>
            {(['fixed', 'variable'] as IncomeType[]).map(t => (
              <button key={t} className={`${styles.toggleOption} ${sourceForm.income_type === t ? styles.toggleOptionActive : ''}`}
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
              <button key={f} className={`${styles.toggleOption} ${sourceForm.frequency === f ? styles.toggleOptionActive : ''}`}
                onClick={() => setSourceForm({ ...sourceForm, frequency: f })}>{FREQ_LABELS[f]}</button>
            ))}
          </div>
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>
            {sourceForm.income_type === 'fixed' ? '¿Cuánto recibes por pago?' : '¿Cuánto sueles recibir?'}
          </label>
          <MoneyInput fullWidth variant="earn" value={parseFloat(sourceForm.base_amount) || 0} onChange={v => setSourceForm({ ...sourceForm, base_amount: String(v) })} />
        </div>
        <div className={`${modalStyles.fieldReveal} ${sourceForm.frequency === 'monthly' ? modalStyles.fieldRevealVisible : ''}`}>
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>¿Qué día del mes lo recibes?</label>
            <DayInput value={sourceForm.due_day} onChange={d => setSourceForm({ ...sourceForm, due_day: d })} />
          </div>
        </div>
        <div className={modalStyles.formActions}>
          {sourceForm.label.trim() && (sourceForm.income_type !== 'fixed' || parseFloat(sourceForm.base_amount) > 0) && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnEarn}`} onClick={handleAddSource}>Agregar</button>
          )}
        </div>
      </Modal>

      <Modal open={editSourceModal !== null} onClose={() => { setEditSourceModal(null); setEditSourceForm(EMPTY_SOURCE); }} title="Editar fuente de ingreso" variant="earn">
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Nombre</label>
          <input className={modalStyles.formInput} placeholder="ej. Salario, Comisiones" maxLength={150}
            value={editSourceForm.label} onChange={e => setEditSourceForm({ ...editSourceForm, label: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿El monto de esta fuente...?</label>
          <div className={styles.toggleRow}>
            {(['fixed', 'variable'] as IncomeType[]).map(t => (
              <button key={t} className={`${styles.toggleOption} ${editSourceForm.income_type === t ? styles.toggleOptionActive : ''}`}
                onClick={() => setEditSourceForm({ ...editSourceForm, income_type: t })}>
                {t === 'fixed' ? 'Siempre fijo' : 'Cambia cada mes'}
              </button>
            ))}
          </div>
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cada cuánto lo recibes?</label>
          <div className={styles.toggleRow}>
            {(['weekly', 'biweekly', 'monthly'] as Frequency[]).map(f => (
              <button key={f} className={`${styles.toggleOption} ${editSourceForm.frequency === f ? styles.toggleOptionActive : ''}`}
                onClick={() => setEditSourceForm({ ...editSourceForm, frequency: f })}>{FREQ_LABELS[f]}</button>
            ))}
          </div>
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>
            {editSourceForm.income_type === 'fixed' ? '¿Cuánto recibes por pago?' : '¿Cuánto sueles recibir?'}
          </label>
          <MoneyInput fullWidth variant="earn" value={parseFloat(editSourceForm.base_amount) || 0} onChange={v => setEditSourceForm({ ...editSourceForm, base_amount: String(v) })} />
        </div>
        <div className={`${modalStyles.fieldReveal} ${editSourceForm.frequency === 'monthly' ? modalStyles.fieldRevealVisible : ''}`}>
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>¿Qué día del mes lo recibes?</label>
            <DayInput value={editSourceForm.due_day} onChange={d => setEditSourceForm({ ...editSourceForm, due_day: d })} />
          </div>
        </div>
        <div className={modalStyles.formField}>
          <NoteInput
            value={editSourceForm.note}
            onChange={note => setEditSourceForm({ ...editSourceForm, note })}
            onRemove={() => setConfirm({
              msg: '¿Eliminar la razón del cambio?',
              action: () => { setEditSourceForm(f => ({ ...f, note: '' })); setConfirm(null); },
            })}
          />
        </div>
        <div className={modalStyles.formActions}>
          {editSourceForm.label.trim() && (editSourceForm.income_type !== 'fixed' || parseFloat(editSourceForm.base_amount) > 0) && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnEarn}`} onClick={submitEditSource}>Guardar cambios</button>
          )}
        </div>
      </Modal>
    </>
  );
}
