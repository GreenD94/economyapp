'use client';
import { useState, useEffect } from 'react';
import { getExpectedSlots, formatCountdown } from '../transactions.utils';
import { fmtAmt } from '../transactions.types';
import styles from '../styles/Transactions.module.css';
import type { TransactionCtx } from '../hooks/useTransactions.hook';
import type { IncomeSourceFromAPI } from '@/features/core/types/api.types';

const FREQ_DESC: Record<string, string> = {
  weekly: 'Cada semana',
  biweekly: 'Cada 15 días',
  monthly: 'Cada mes',
};

export function SourceDetailSheet({ src, ctx, onClose }: {
  src: IncomeSourceFromAPI;
  ctx: TransactionCtx;
  onClose: () => void;
}) {
  const { incomeHook, openConfirmSrc, openEditSource, openUnconfirmSrc } = ctx;
  const confirmed = incomeHook.incomes.filter(i => i.source_id === src.id);
  const slots = getExpectedSlots(src, incomeHook.month);
  const [closing, setClosing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const todayMidnight = new Date();

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);
  todayMidnight.setHours(0, 0, 0, 0);

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
          <span className={styles.detailTitle}>{src.label}</span>
          <span className={styles.detailSub}>
            {FREQ_DESC[src.frequency]} · {src.income_type === 'fixed' ? 'Siempre fijo' : 'Variable'}
          </span>
        </div>

        <div className={styles.detailDots}>
          {slots.map((_, i) => (
            <span key={i}
              className={`material-symbols-outlined ${confirmed[i] ? styles.detailDotDone : styles.detailDotPending}`}>
              {confirmed[i] ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          ))}
        </div>

        <div className={styles.detailSlots}>
          {slots.map((slot, i) => {
            const entry = confirmed[i] ?? null;
            return (
              <div key={i} className={`${styles.detailSlot} ${entry ? styles.detailSlotDone : ''}`}>
                <div className={styles.detailSlotMeta}>
                  <span className={styles.detailSlotLabel}>{slot.label}</span>
                  <span className={entry ? styles.detailSlotDate : styles.detailSlotCountdown}>
                    {entry
                      ? new Date(entry.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })
                      : formatCountdown(slot.date)}
                  </span>
                </div>
                {entry ? (
                  <div className={styles.detailSlotRight}>
                    <span className={styles.detailSlotAmount}>${fmtAmt(parseFloat(entry.amount))}</span>
                    <button className={styles.detailUnconfirmBtn}
                      onClick={() => closeAndThen(() => openUnconfirmSrc(src, entry, i + 1, slots.length))}>
                      Quitar
                    </button>
                  </div>
                ) : (
                  slot.date <= todayMidnight && (
                    <button className={styles.detailConfirmBtn}
                      onClick={() => closeAndThen(() => openConfirmSrc(src, i + 1, slots.length))}>
                      Confirmar
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.detailFooter}>
          <button className={styles.detailEditBtn} onClick={() => closeAndThen(() => openEditSource(src))}>
            <span className="material-symbols-outlined">edit</span>
            Editar fuente
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
