'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/features/core/components/Modal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { NoteInput } from '@/features/core/components/NoteInput.component';
import { ExpenseSrcPickerKeyboard } from './ExpenseSrcPickerKeyboard';
import { CATEGORIES } from '@/features/expenses/hooks/useExpenses.hook';
import modalStyles from '@/features/core/components/Modal.module.css';
import styles from '../styles/Transactions.module.css';
import { nowISO, EMPTY_EXPENSE, fmtAmt } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

type PickerMode = 'category' | 'classification';
const CLASSIFICATIONS = ['Necesidad', 'Calidad de vida', 'Productividad', 'Capricho'];

function firstOfMonthISO(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1, 12, 0, 0).toISOString();
}

export function ExpenseModals({ ctx }: { ctx: TransactionCtx }) {
  const {
    addExpenseOpen, setAddExpenseOpen, expenseForm, setExpenseForm, submitAddExpense,
    editExpense, setEditExpense, editExpenseForm, setEditExpenseForm, editExpenseNote, setEditExpenseNote, submitEditExpense,
    unconfirmExpenseModal, setUnconfirmExpenseModal, submitUnconfirmExpense,
    setConfirm,
  } = ctx;

  const viewedMonth = ctx.expenseHook.month;
  const currMonth   = new Date().toISOString().slice(0, 7);
  const isCurrentViewMonth = viewedMonth === currMonth;

  useEffect(() => {
    if (addExpenseOpen && !isCurrentViewMonth && !expenseForm.date.startsWith(viewedMonth)) {
      setExpenseForm(f => ({ ...f, date: firstOfMonthISO(viewedMonth) }));
    }
  }, [addExpenseOpen, viewedMonth]);

  const addFormDate = isCurrentViewMonth
    ? expenseForm.date
    : (expenseForm.date.startsWith(viewedMonth) ? expenseForm.date : firstOfMonthISO(viewedMonth));

  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const activeForm = addExpenseOpen ? expenseForm : editExpenseForm;

  function handlePickerSelect(v: string) {
    if (!pickerMode) return;
    const field = pickerMode === 'category' ? 'category' : 'type';
    if (addExpenseOpen) setExpenseForm({ ...expenseForm, [field]: v });
    else setEditExpenseForm({ ...editExpenseForm, [field]: v });
    setPickerMode(null);
  }

  return (
    <>
      {/* Add expense */}
      <Modal open={addExpenseOpen} onClose={() => { setAddExpenseOpen(false); setExpenseForm({ ...EMPTY_EXPENSE, date: nowISO() }); }} title="Agregar gasto" variant="spend">
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo pagaste?" variant="spend" value={addFormDate}
            month={viewedMonth} onChange={iso => setExpenseForm({ ...expenseForm, date: iso })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Qué compraste o pagaste?</label>
          <input className={modalStyles.formInput} placeholder="ej. Supermercado" maxLength={150}
            value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto gastaste?</label>
          <MoneyInput fullWidth variant="spend" value={parseFloat(expenseForm.amount) || 0}
            onChange={v => setExpenseForm({ ...expenseForm, amount: String(v) })} />
        </div>
        <div className={styles.formPickerPairRow}>
          <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => setPickerMode('category')}>
            <div className={styles.formPickerContent}>
              <span className={modalStyles.formLabel}>¿A qué categoría?</span>
              {expenseForm.category && <div className={styles.formPickerChips}><span className={styles.formPickerChip}>{expenseForm.category}</span></div>}
            </div>
          </button>
          <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => setPickerMode('classification')}>
            <div className={styles.formPickerContent}>
              <span className={modalStyles.formLabel}>¿Cómo clasificas?</span>
              {expenseForm.type && <div className={styles.formPickerChips}><span className={styles.formPickerChip}>{expenseForm.type}</span></div>}
            </div>
          </button>
        </div>
        <div className={modalStyles.formActions}>
          {expenseForm.description.trim() && parseFloat(expenseForm.amount) > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnSpend}`} onClick={submitAddExpense}>Guardar</button>
          )}
        </div>
      </Modal>

      {/* Edit expense */}
      <Modal open={editExpense !== null} onClose={() => { setEditExpense(null); setEditExpenseNote(''); }} title="Editar gasto" variant="spend">
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo pagaste?" value={editExpenseForm.date}
            month={viewedMonth} onChange={iso => setEditExpenseForm({ ...editExpenseForm, date: iso })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Qué compraste o pagaste?</label>
          <input className={modalStyles.formInput} maxLength={150}
            value={editExpenseForm.description} onChange={e => setEditExpenseForm({ ...editExpenseForm, description: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto gastaste?</label>
          <MoneyInput fullWidth variant="spend" value={parseFloat(editExpenseForm.amount) || 0}
            onChange={v => setEditExpenseForm({ ...editExpenseForm, amount: String(v) })} />
        </div>
        <div className={styles.formPickerPairRow}>
          <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => setPickerMode('category')}>
            <div className={styles.formPickerContent}>
              <span className={modalStyles.formLabel}>¿A qué categoría?</span>
              {editExpenseForm.category && <div className={styles.formPickerChips}><span className={styles.formPickerChip}>{editExpenseForm.category}</span></div>}
            </div>
          </button>
          <button className={`${styles.formPickerRow} ${styles.formPickerHalf}`} onClick={() => setPickerMode('classification')}>
            <div className={styles.formPickerContent}>
              <span className={modalStyles.formLabel}>¿Cómo clasificas?</span>
              {editExpenseForm.type && <div className={styles.formPickerChips}><span className={styles.formPickerChip}>{editExpenseForm.type}</span></div>}
            </div>
          </button>
        </div>
        <div className={modalStyles.formField}>
          <NoteInput value={editExpenseNote} onChange={setEditExpenseNote}
            onRemove={() => setConfirm({ msg: '¿Eliminar la razón del cambio?', action: () => { setEditExpenseNote(''); setConfirm(null); } })} />
        </div>
        <div className={modalStyles.formActions}>
          {editExpenseForm.description.trim() && parseFloat(editExpenseForm.amount) > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnSpend}`} onClick={submitEditExpense}>Guardar cambios</button>
          )}
        </div>
      </Modal>

      {/* Unconfirm expense — required note */}
      <Modal open={unconfirmExpenseModal !== null} onClose={() => setUnconfirmExpenseModal(null)} title="Quitar confirmación" variant="spend">
        {unconfirmExpenseModal && (
          <div className={modalStyles.modalSubRow}>
            <span className={modalStyles.modalSubDate}>
              Pago {unconfirmExpenseModal.slotIndex}/{unconfirmExpenseModal.totalSlots}
              {' · '}
              {new Date(unconfirmExpenseModal.entry.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className={modalStyles.modalSubAmount}>${fmtAmt(parseFloat(unconfirmExpenseModal.entry.amount))}</span>
          </div>
        )}
        <p className={modalStyles.modalHeading}>{unconfirmExpenseModal?.source.label}</p>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Por qué quitas esta confirmación? <span style={{ color: 'var(--c-red-border)' }}>*</span></label>
          <textarea
            className={modalStyles.formInput}
            style={{ minHeight: 80, resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
            maxLength={500}
            placeholder="Ej: el pago no se realizó, hubo un error al confirmar..."
            value={unconfirmExpenseModal?.note ?? ''}
            onChange={e => setUnconfirmExpenseModal(m => m ? { ...m, note: e.target.value } : m)}
          />
        </div>
        <div className={modalStyles.formActions}>
          {(unconfirmExpenseModal?.note.trim().split(/\s+/).filter(Boolean).length ?? 0) >= 2 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.confirmDanger}`} onClick={submitUnconfirmExpense}>
              Quitar confirmación
            </button>
          )}
        </div>
      </Modal>

      {pickerMode && (
        <ExpenseSrcPickerKeyboard
          mode={pickerMode}
          options={pickerMode === 'category' ? [...CATEGORIES] : CLASSIFICATIONS}
          selected={pickerMode === 'category' ? activeForm.category : activeForm.type}
          onSelect={handlePickerSelect}
          onAddNew={() => {}}
          onClose={() => setPickerMode(null)} />
      )}
    </>
  );
}
