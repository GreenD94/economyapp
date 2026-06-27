'use client';
import { useState, useEffect } from 'react';
import { getExpectedSlots, formatCountdown } from '../transactions.utils';
import { fmtAmt } from '../transactions.types';
import styles from '../styles/Transactions.module.css';
import type { TransactionCtx } from '../hooks/useTransactions.hook';
import type { ExpenseSourceFromAPI } from '@/features/core/types/api.types';

const FREQ_DESC: Record<string, string> = {
  weekly: 'Cada semana',
  biweekly: 'Cada 15 días',
  monthly: 'Cada mes',
};

export function ExpenseSourceDetailSheet({ src, ctx, onClose }: {
  src: ExpenseSourceFromAPI;
  ctx: TransactionCtx;
  onClose: () => void;
}) {
  const { expenseHook, confirmedExpenseEntries, openConfirmExpenseSrc, openEditExpenseSource, openUnconfirmExpenseEntry } = ctx;
  const confirmed = confirmedExpenseEntries(src.id);
  const slots = getExpectedSlots(src, expenseHook.month);
  const [closing, setClosing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function closeAndThen(action?: () => void) {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); action?.(); }, 300);
  }

  return (
    <>
      <div
        className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`}
        onClick={() => closeAndThen()}
      />
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.detailBody} ${revealed ? styles.detailRevealed : ''}`}>

          <div className={styles.detailHeader}>
            <span className={`${styles.detailTitle} ${styles.detailTitleSpend}`}>{src.label}</span>
            <span className={styles.detailSub}>
              {FREQ_DESC[src.frequency]} · {src.category} · {src.classification}
            </span>
          </div>

          <div className={styles.detailDots}>
            {slots.map((_, i) => (
              <span key={i}
                className={`material-symbols-outlined ${confirmed[i] ? styles.detailDotDoneSpend : styles.detailDotPending}`}>
                {confirmed[i] ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            ))}
          </div>

          <div className={styles.detailSlots}>
            {slots.map((slot, i) => {
              const entry = confirmed[i] ?? null;
              return (
                <div key={i} className={`${styles.detailSlot} ${entry ? styles.detailSlotDoneSpend : ''}`}>
                  <div className={styles.detailSlotMeta}>
                    <span className={styles.detailSlotLabel}>{slot.label}</span>
                    <span className={entry ? styles.detailSlotDateSpend : styles.detailSlotCountdown}>
                      {entry
                        ? new Date(entry.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })
                        : formatCountdown(slot.date)}
                    </span>
                  </div>
                  {entry ? (
                    <div className={styles.detailSlotRight}>
                      <span className={`${styles.detailSlotAmount} ${styles.detailSlotAmountSpend}`}>
                        ${fmtAmt(parseFloat(entry.amount))}
                      </span>
                      <button className={styles.detailUnconfirmBtn}
                        onClick={() => closeAndThen(() => openUnconfirmExpenseEntry(entry, src, i + 1, slots.length))}>
                        Quitar
                      </button>
                    </div>
                  ) : (
                    slot.date <= todayMidnight && (
                      <button className={`${styles.detailConfirmBtn} ${styles.detailConfirmBtnSpend}`}
                        onClick={() => closeAndThen(() => openConfirmExpenseSrc(src, i + 1, slots.length))}>
                        {src.expense_type === 'fixed' ? 'Confirmar' : 'Ingresar monto'}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.detailFooter}>
            <button className={`${styles.detailEditBtn} ${styles.detailEditBtnSpend}`}
              onClick={() => closeAndThen(() => openEditExpenseSource(src))}>
              <span className="material-symbols-outlined">edit</span>
              Editar
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
