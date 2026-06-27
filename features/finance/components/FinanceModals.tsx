'use client';
import { Modal }        from '@/features/core/components/Modal.component';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import { InfoModal }    from '@/features/core/components/InfoModal.component';
import { MoneyInput }   from '@/features/core/components/MoneyInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { INFO }         from '@/features/core/content/info.content';
import modalStyles from '@/features/core/components/Modal.module.css';
import finStyles from '../styles/Finance.module.css';
import { nowISO, fmtAmt } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function FinanceModals({ ctx }: { ctx: FinanceCtx }) {
  const {
    editBudgetCat, setEditBudgetCat, editBudgetAmt, setEditBudgetAmt, submitEditBudget,
    confirmPayCat, setConfirmPayCat, confirmPayAmt, setConfirmPayAmt, confirmPayDate, setConfirmPayDate, submitConfirmPay,
    budgetDetail, setBudgetDetail,
    addNetworthOpen, setAddNetworthOpen, addNetworthForm, setAddNetworthForm, submitAddNetworth,
    editNetworth, setEditNetworth, submitEditNetworth,
    confirm, setConfirm,
    infoBudget, setInfoBudget, infoNetworth, setInfoNetworth,
  } = ctx;

  const infoP   = INFO.finance.budget;
  const infoPat = INFO.finance.networth;

  return (
    <>
      <Modal open={editBudgetCat !== null} onClose={() => setEditBudgetCat(null)} title={`Editar: ${editBudgetCat}`}>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto asignas mensualmente?</label>
          <MoneyInput fullWidth value={parseFloat(editBudgetAmt) || 0} onChange={v => setEditBudgetAmt(String(v))} />
        </div>
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={() => setEditBudgetCat(null)}>Cancelar</button>
          <button className={modalStyles.submitBtn} onClick={submitEditBudget}>Guardar</button>
        </div>
      </Modal>

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
          <button className={modalStyles.submitBtn} onClick={submitConfirmPay}>Confirmar pago</button>
        </div>
      </Modal>

      <Modal open={budgetDetail !== null} onClose={() => setBudgetDetail(null)} title={budgetDetail?.category ?? ''}>
        {budgetDetail && (() => {
          const spent  = parseFloat(budgetDetail.spent_this_month);
          const budget = parseFloat(budgetDetail.monthly_amount);
          const remain = parseFloat(budgetDetail.remaining);
          const pct    = budget > 0 ? (spent / budget) * 100 : 0;
          return (
            <>
              <div className={finStyles.detailStat}>
                <span className={finStyles.detailStatLabel}>Presupuesto mensual</span>
                <span className={finStyles.detailStatValue}>${fmtAmt(budget)}</span>
              </div>
              <div className={finStyles.detailStat}>
                <span className={finStyles.detailStatLabel}>Gastado este mes</span>
                <span className={`${finStyles.detailStatValue} ${finStyles.detailStatValueSpend}`}>${fmtAmt(spent)}</span>
              </div>
              <div className={finStyles.detailStat}>
                <span className={finStyles.detailStatLabel}>{remain >= 0 ? 'Restante' : 'Excedido'}</span>
                <span className={`${finStyles.detailStatValue} ${remain >= 0 ? finStyles.detailStatValueAvail : finStyles.detailStatValueOver}`}>
                  {remain >= 0 ? `$${fmtAmt(remain)}` : `−$${fmtAmt(Math.abs(remain))}`}
                </span>
              </div>
              <div className={finStyles.detailStat}>
                <span className={finStyles.detailStatLabel}>% Utilizado</span>
                <span className={finStyles.detailStatValue}>{pct.toFixed(1)}%</span>
              </div>
            </>
          );
        })()}
      </Modal>

      <Modal open={addNetworthOpen} onClose={() => setAddNetworthOpen(false)} title="Registrar ahorro real">
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Mes</label>
          <input className={modalStyles.formInput} type="date" value={addNetworthForm.month}
            onChange={e => setAddNetworthForm({ ...addNetworthForm, month: e.target.value })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Ahorro real</label>
          <MoneyInput fullWidth value={parseFloat(addNetworthForm.amount) || 0}
            onChange={v => setAddNetworthForm({ ...addNetworthForm, amount: String(v) })} />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>Notas (opcional)</label>
          <input className={modalStyles.formInput} maxLength={500} value={addNetworthForm.notes}
            onChange={e => setAddNetworthForm({ ...addNetworthForm, notes: e.target.value })} />
        </div>
        <div className={modalStyles.formActions}>
          <button className={modalStyles.secondaryBtn} onClick={() => setAddNetworthOpen(false)}>Cancelar</button>
          <button className={modalStyles.submitBtn} onClick={submitAddNetworth}>Guardar</button>
        </div>
      </Modal>

      <Modal open={editNetworth !== null} onClose={() => setEditNetworth(null)} title="Editar registro">
        {editNetworth && (
          <>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Mes</label>
              <input className={modalStyles.formInput} type="date" value={editNetworth.month}
                onChange={e => setEditNetworth({ ...editNetworth, month: e.target.value })} />
            </div>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Ahorro real</label>
              <MoneyInput fullWidth value={parseFloat(editNetworth.amount) || 0}
                onChange={v => setEditNetworth({ ...editNetworth, amount: String(v) })} />
            </div>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>Notas</label>
              <input className={modalStyles.formInput} maxLength={500} value={editNetworth.notes}
                onChange={e => setEditNetworth({ ...editNetworth, notes: e.target.value })} />
            </div>
            <div className={modalStyles.formActions}>
              <button className={modalStyles.secondaryBtn} onClick={() => setEditNetworth(null)}>Cancelar</button>
              <button className={modalStyles.submitBtn} onClick={submitEditNetworth}>Guardar</button>
            </div>
          </>
        )}
      </Modal>

      {confirm && (
        <ConfirmModal open={true} onClose={() => setConfirm(null)} onConfirm={confirm.action} message={confirm.msg} />
      )}

      <InfoModal open={infoBudget} onClose={() => setInfoBudget(false)} title={infoP.title}
        howItWorks={<>{infoP.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoP.glossary} />
      <InfoModal open={infoNetworth} onClose={() => setInfoNetworth(false)} title={infoPat.title}
        howItWorks={<>{infoPat.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoPat.glossary} />
    </>
  );
}
