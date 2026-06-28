'use client';
import { useEffect } from 'react';
import { Modal } from '@/features/core/components/Modal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { NoteInput } from '@/features/core/components/NoteInput.component';
import modalStyles from '@/features/core/components/Modal.module.css';
import { EMPTY_INCOME } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

function firstOfMonthISO(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1, 12, 0, 0).toISOString();
}

export function IncomeModals({ ctx }: { ctx: TransactionCtx }) {
  const {
    addIncomeOpen, setAddIncomeOpen, incomeForm, setIncomeForm, submitAddIncome,
    editIncome, setEditIncome, editIncomeForm, setEditIncomeForm,
    editIncomeNote, setEditIncomeNote, submitEditIncome,
  } = ctx;

  const viewedMonth = ctx.incomeHook.month;
  const currMonth   = new Date().toISOString().slice(0, 7);
  const isCurrentViewMonth = viewedMonth === currMonth;

  useEffect(() => {
    if (addIncomeOpen && !isCurrentViewMonth && !incomeForm.date.startsWith(viewedMonth)) {
      setIncomeForm(f => ({ ...f, date: firstOfMonthISO(viewedMonth) }));
    }
  }, [addIncomeOpen, viewedMonth]);

  const addFormDate = isCurrentViewMonth
    ? incomeForm.date
    : (incomeForm.date.startsWith(viewedMonth) ? incomeForm.date : firstOfMonthISO(viewedMonth));

  return (
    <>
      <Modal open={addIncomeOpen} onClose={() => { setAddIncomeOpen(false); setIncomeForm(EMPTY_INCOME); }} title="Agregar ingreso" variant="earn">
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo lo recibiste?" variant="earn" value={addFormDate}
            month={viewedMonth} onChange={iso => setIncomeForm({ ...incomeForm, date: iso })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿De dónde viene este ingreso?</label>
          <input className={modalStyles.formInput} placeholder="ej. Bono, Freelance" maxLength={150}
            value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto recibiste?</label>
          <MoneyInput fullWidth variant="earn" value={parseFloat(incomeForm.amount) || 0}
            onChange={v => setIncomeForm({ ...incomeForm, amount: String(v) })} />
        </div>
        <div className={modalStyles.formActions}>
          {incomeForm.source.trim() && parseFloat(incomeForm.amount) > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnEarn}`} onClick={submitAddIncome}>Guardar</button>
          )}
        </div>
      </Modal>

      <Modal open={editIncome !== null} onClose={() => { setEditIncome(null); setEditIncomeNote(''); }} title="Editar ingreso" variant="earn">
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo lo recibiste?" value={editIncomeForm.date}
            month={viewedMonth} onChange={iso => setEditIncomeForm({ ...editIncomeForm, date: iso })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿De dónde viene este ingreso?</label>
          <input className={modalStyles.formInput} maxLength={150}
            value={editIncomeForm.source} onChange={e => setEditIncomeForm({ ...editIncomeForm, source: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto recibiste?</label>
          <MoneyInput fullWidth variant="earn" value={parseFloat(editIncomeForm.amount) || 0}
            onChange={v => setEditIncomeForm({ ...editIncomeForm, amount: String(v) })} />
        </div>
        <div className={modalStyles.formField}>
          <NoteInput
            value={editIncomeNote}
            onChange={setEditIncomeNote}
            placeholder="¿Por qué estás editando este ingreso?"
          />
        </div>
        <div className={modalStyles.formActions}>
          {editIncomeForm.source.trim() && parseFloat(editIncomeForm.amount) > 0 && (
            <button className={`${modalStyles.submitBtn} ${modalStyles.submitBtnEarn}`} onClick={submitEditIncome}>Guardar cambios</button>
          )}
        </div>
      </Modal>
    </>
  );
}
