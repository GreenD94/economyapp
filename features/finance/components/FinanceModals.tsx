'use client';
import { Modal }        from '@/features/core/components/Modal.component';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import { InfoModal }    from '@/features/core/components/InfoModal.component';
import { MoneyInput }   from '@/features/core/components/MoneyInput.component';
import { DateTimePicker } from '@/features/core/components/DateTimePicker.component';
import { INFO }         from '@/features/core/content/info.content';
import { BudgetModals }        from './BudgetModals';
import { BolsilloDetailSheet } from './BolsilloDetailSheet';
import modalStyles from '@/features/core/components/Modal.module.css';
import { nowISO } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function FinanceModals({ ctx }: { ctx: FinanceCtx }) {
  const {
    addNetworthOpen, setAddNetworthOpen, addNetworthForm, setAddNetworthForm, submitAddNetworth,
    editNetworth, setEditNetworth, submitEditNetworth,
    confirm, setConfirm,
    infoBudget, setInfoBudget, infoNetworth, setInfoNetworth,
    bolsilloDetail, setBolsilloDetail,
  } = ctx;

  const infoP   = INFO.finance.budget;
  const infoPat = INFO.finance.networth;

  return (
    <>
      <BudgetModals ctx={ctx} />
      {bolsilloDetail && (
        <BolsilloDetailSheet
          bolsillo={bolsilloDetail}
          ctx={ctx}
          onClose={() => setBolsilloDetail(null)}
        />
      )}

      {/* ── Add net worth ── */}
      <Modal open={addNetworthOpen} onClose={() => setAddNetworthOpen(false)} title="Registrar ahorro real">
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Para qué mes es este registro?</label>
          <DateTimePicker
            value={addNetworthForm.month ? new Date(addNetworthForm.month.slice(0, 7) + '-01T12:00:00').toISOString() : nowISO()}
            onChange={iso => setAddNetworthForm({ ...addNetworthForm, month: iso.slice(0, 7) })}
          />
        </div>
        <div className={modalStyles.formField}>
          <label className={modalStyles.formLabel}>¿Cuánto ahorraste este mes?</label>
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
          {parseFloat(addNetworthForm.amount) > 0 && addNetworthForm.month && (
            <button className={modalStyles.submitBtn} onClick={submitAddNetworth}>Guardar</button>
          )}
        </div>
      </Modal>

      {/* ── Edit net worth ── */}
      <Modal open={editNetworth !== null} onClose={() => setEditNetworth(null)} title="Editar registro">
        {editNetworth && (
          <>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>¿Para qué mes es este registro?</label>
              <DateTimePicker
                value={editNetworth.month ? new Date(editNetworth.month.slice(0, 7) + '-01T12:00:00').toISOString() : nowISO()}
                onChange={iso => setEditNetworth({ ...editNetworth, month: iso.slice(0, 7) })}
              />
            </div>
            <div className={modalStyles.formField}>
              <label className={modalStyles.formLabel}>¿Cuánto ahorraste este mes?</label>
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
              {parseFloat(editNetworth.amount) > 0 && editNetworth.month && (
                <button className={modalStyles.submitBtn} onClick={submitEditNetworth}>Guardar</button>
              )}
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
