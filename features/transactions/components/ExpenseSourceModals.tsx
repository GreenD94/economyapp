'use client';
import { useState } from 'react';
import { Modal } from '@/features/core/components/Modal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DayInput } from '@/features/core/components/DayInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { CATEGORIES } from '@/features/expenses/hooks/useExpenses.hook';
import { ExpenseSrcPickerKeyboard } from './ExpenseSrcPickerKeyboard';
import modalStyles from '@/features/core/components/Modal.module.css';
import styles from '../styles/Transactions.module.css';
import { nowISO, EMPTY_EXPENSE_SOURCE, FREQ_LABELS, type Frequency, type ExpenseSourceForm } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

const BASE_CLASSIFICATIONS = ['Necesidad', 'Calidad de vida', 'Productividad', 'Capricho'];
type PickerMode = 'category' | 'classification';

function ExpSrcForm({ form, setForm, onOpenPicker }: {
  form: ExpenseSourceForm;
  setForm: (f: ExpenseSourceForm) => void;
  onOpenPicker: (m: PickerMode) => void;
}) {
  return (
    <>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Cómo se llama este gasto?</label>
        <input className={modalStyles.formInput} maxLength={150}
          value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
      </div>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Cuánto sueles pagar?</label>
        <MoneyInput fullWidth variant="spend" value={parseFloat(form.base_amount) || 0}
          onChange={v => setForm({ ...form, base_amount: v > 0 ? String(v) : '' })} />
      </div>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Cada cuánto lo pagas?</label>
        <div className={styles.toggleRow}>
          {(['weekly', 'biweekly', 'monthly'] as Frequency[]).map(f => (
            <button key={f}
              className={`${styles.toggleOption} ${form.frequency === f ? styles.toggleOptionActiveSpend : ''}`}
              onClick={() => setForm({ ...form, frequency: f })}>{FREQ_LABELS[f]}</button>
          ))}
        </div>
      </div>
      <div className={`${modalStyles.fieldReveal} ${form.frequency === 'monthly' ? modalStyles.fieldRevealVisible : ''}`}>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Qué día del mes?</label>
          <DayInput value={form.due_day} onChange={d => setForm({ ...form, due_day: d })} />
        </div>
      </div>
      <div className={styles.formPickerPairRow}>
        <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => onOpenPicker('category')}>
          <div className={styles.formPickerContent}>
            <span className={modalStyles.formLabel}>¿A qué categoría?</span>
            {form.category && (
              <div className={styles.formPickerChips}>
                <span className={styles.formPickerChip}>{form.category}</span>
              </div>
            )}
          </div>
        </button>
        <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => onOpenPicker('classification')}>
          <div className={styles.formPickerContent}>
            <span className={modalStyles.formLabel}>¿Cómo clasificas?</span>
            {form.classification && (
              <div className={styles.formPickerChips}>
                <span className={styles.formPickerChip}>{form.classification}</span>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  );
}

export function ExpenseSourceModals({ ctx }: { ctx: TransactionCtx }) {
  const {
    addExpenseSourceOpen, setAddExpenseSourceOpen, expenseSourceForm, setExpenseSourceForm, handleAddExpenseSource,
    editExpenseSourceModal, setEditExpenseSourceModal, editExpenseSourceForm, setEditExpenseSourceForm, submitEditExpenseSource,
    confirmExpenseSrcModal, setConfirmExpenseSrcModal, submitConfirmExpenseSrc,
  } = ctx;

  const [formPickerMode, setFormPickerMode] = useState<PickerMode | null>(null);
  const [extraCats, setExtraCats]           = useState<string[]>([]);
  const [extraClasses, setExtraClasses]     = useState<string[]>([]);

  const allCats    = [...CATEGORIES, ...extraCats];
  const allClasses = [...BASE_CLASSIFICATIONS, ...extraClasses];

  const activeForm    = addExpenseSourceOpen ? expenseSourceForm : editExpenseSourceForm;
  const setActiveForm = addExpenseSourceOpen ? setExpenseSourceForm : setEditExpenseSourceForm;

  function handlePickerSelect(v: string) {
    if (!formPickerMode) return;
    const field = formPickerMode === 'category' ? 'category' : 'classification';
    setActiveForm({ ...activeForm, [field]: v });
  }

  function handlePickerAddNew(v: string) {
    if (formPickerMode === 'category') setExtraCats(p => p.includes(v) ? p : [...p, v]);
    else setExtraClasses(p => p.includes(v) ? p : [...p, v]);
  }

  function clearAdd()  { setAddExpenseSourceOpen(false); setExpenseSourceForm(EMPTY_EXPENSE_SOURCE); }
  function clearEdit() { setEditExpenseSourceModal(null); setEditExpenseSourceForm(EMPTY_EXPENSE_SOURCE); }

  const canAdd  = !!(expenseSourceForm.label.trim() && expenseSourceForm.category && expenseSourceForm.classification && parseFloat(expenseSourceForm.base_amount) > 0);
  const canEdit = !!(editExpenseSourceForm.label.trim() && editExpenseSourceForm.category && editExpenseSourceForm.classification && parseFloat(editExpenseSourceForm.base_amount) > 0);

  return (
    <>
      <Modal open={addExpenseSourceOpen} onClose={clearAdd} title="Agregar gasto frecuente" variant="spend">
        <ExpSrcForm form={expenseSourceForm} setForm={setExpenseSourceForm} onOpenPicker={setFormPickerMode} />
        <div className={modalStyles.formActions}>
          {canAdd && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnSpend}`} onClick={handleAddExpenseSource}>Guardar</button>
          )}
        </div>
      </Modal>

      <Modal open={editExpenseSourceModal !== null} onClose={clearEdit} title="Editar gasto frecuente" variant="spend">
        <ExpSrcForm form={editExpenseSourceForm} setForm={setEditExpenseSourceForm} onOpenPicker={setFormPickerMode} />
        <div className={modalStyles.formActions}>
          {canEdit && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnSpend}`} onClick={submitEditExpenseSource}>Guardar cambios</button>
          )}
        </div>
      </Modal>

      <Modal open={confirmExpenseSrcModal !== null} onClose={() => setConfirmExpenseSrcModal(null)}
        title={confirmExpenseSrcModal?.source.label ?? ''} variant="spend">
        {confirmExpenseSrcModal && (
          <div className={modalStyles.modalSubRow}>
            <span className={modalStyles.modalSubDate}>
              Pago {confirmExpenseSrcModal.slotIndex}/{confirmExpenseSrcModal.totalSlots}
            </span>
          </div>
        )}
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto pagaste?</label>
          <MoneyInput fullWidth variant="spend"
            value={parseFloat(confirmExpenseSrcModal?.amount ?? '0') || 0}
            onChange={v => setConfirmExpenseSrcModal(m => m ? { ...m, amount: String(v) } : m)} />
        </div>
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo pagaste?" variant="spend"
            value={confirmExpenseSrcModal?.date ?? nowISO()}
            onChange={iso => setConfirmExpenseSrcModal(m => m ? { ...m, date: iso } : m)} />
        </div>
        <div className={modalStyles.formActions}>
          {parseFloat(confirmExpenseSrcModal?.amount ?? '0') > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnSpend}`} onClick={submitConfirmExpenseSrc}>Confirmar pago</button>
          )}
        </div>
      </Modal>

      {formPickerMode && (
        <ExpenseSrcPickerKeyboard
          mode={formPickerMode}
          options={formPickerMode === 'category' ? allCats : allClasses}
          selected={formPickerMode === 'category' ? activeForm.category : activeForm.classification}
          onSelect={handlePickerSelect}
          onAddNew={handlePickerAddNew}
          onClose={() => setFormPickerMode(null)} />
      )}
    </>
  );
}
