'use client';
import { useState, useEffect } from 'react';
import { Modal }          from '@/features/core/components/Modal.component';
import { MoneyInput }     from '@/features/core/components/MoneyInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { ExpenseSrcPickerKeyboard } from '@/features/transactions/components/ExpenseSrcPickerKeyboard';
import modalStyles from '@/features/core/components/Modal.module.css';
import finStyles   from '../styles/Finance.module.css';
import { nowISO, BUDGET_CATEGORIES } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function BudgetModals({ ctx }: { ctx: FinanceCtx }) {
  const {
    editBudgetCat, setEditBudgetCat, editBudgetAmt, setEditBudgetAmt, submitEditBudget,
    confirmPayCat, setConfirmPayCat, confirmPayAmt, setConfirmPayAmt,
    confirmPayDate, setConfirmPayDate, submitConfirmPay,
    addBudgetOpen, setAddBudgetOpen, addBudgetCat, setAddBudgetCat,
    addBudgetAmt, setAddBudgetAmt, submitAddBudget,
    budgetHook,
  } = ctx;

  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!addBudgetOpen) setPickerOpen(false);
  }, [addBudgetOpen]);

  const availableCats = BUDGET_CATEGORIES.filter(
    c => !budgetHook.budgets.some(b => b.category === c)
  ) as string[];

  function closeAdd() {
    setAddBudgetOpen(false);
    setAddBudgetCat('');
    setAddBudgetAmt('');
  }

  return (
    <>
      {/* ── Add bolsillo ── */}
      <Modal open={addBudgetOpen} onClose={closeAdd} title="Agregar bolsillo">
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿En qué categoría quieres controlar tus gastos?</label>
          {availableCats.length === 0 ? (
            <p className={finStyles.allCatsAdded}>Ya tienes todas las categorías.</p>
          ) : (
            <button className={finStyles.categoryField} onClick={() => setPickerOpen(true)}>
              {addBudgetCat
                ? <span className={finStyles.categoryFieldSelected}>{addBudgetCat}</span>
                : <span className={finStyles.categoryFieldPlaceholder}>Seleccionar categoría</span>}
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </div>
        {addBudgetCat && (
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>¿Cuánto quieres gastar en {addBudgetCat} este mes?</label>
            <MoneyInput fullWidth value={parseFloat(addBudgetAmt) || 0} onChange={v => setAddBudgetAmt(String(v))} />
          </div>
        )}
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={closeAdd}>Cancelar</button>
          {addBudgetCat && parseFloat(addBudgetAmt) > 0 && (
            <button className={modalStyles.submitBtn} onClick={submitAddBudget}>Agregar</button>
          )}
        </div>
      </Modal>

      {addBudgetOpen && pickerOpen && (
        <ExpenseSrcPickerKeyboard
          mode="category"
          options={availableCats}
          selected={addBudgetCat}
          onSelect={cat => setAddBudgetCat(cat)}
          onAddNew={() => {}}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* ── Edit bolsillo limit ── */}
      <Modal open={editBudgetCat !== null} onClose={() => setEditBudgetCat(null)} title={`Editar: ${editBudgetCat}`}>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto asignas mensualmente?</label>
          <MoneyInput fullWidth value={parseFloat(editBudgetAmt) || 0} onChange={v => setEditBudgetAmt(String(v))} />
        </div>
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={() => setEditBudgetCat(null)}>Cancelar</button>
          {parseFloat(editBudgetAmt) > 0 && (
            <button className={modalStyles.submitBtn} onClick={submitEditBudget}>Guardar</button>
          )}
        </div>
      </Modal>

      {/* ── Confirm payment ── */}
      <Modal open={confirmPayCat !== null} onClose={() => setConfirmPayCat(null)} title={`Confirmar pago: ${confirmPayCat}`}>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto pagaste?</label>
          <MoneyInput fullWidth value={parseFloat(confirmPayAmt) || 0} onChange={v => setConfirmPayAmt(String(v))} />
        </div>
        <div className={modalStyles.formField}>
          <DateTimePicker label="¿Cuándo pagaste?" value={confirmPayDate || nowISO()} onChange={setConfirmPayDate} />
        </div>
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={() => setConfirmPayCat(null)}>Cancelar</button>
          {parseFloat(confirmPayAmt) > 0 && confirmPayDate && (
            <button className={modalStyles.submitBtn} onClick={submitConfirmPay}>Confirmar pago</button>
          )}
        </div>
      </Modal>
    </>
  );
}
