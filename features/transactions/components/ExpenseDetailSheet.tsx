'use client';
import { useState, useEffect } from 'react';
import { fmtAmt } from '../transactions.types';
import styles from '../styles/Transactions.module.css';
import type { ExpenseFromAPI } from '@/features/core/types/api.types';

export function ExpenseDetailSheet({ exp, onEdit, onDelete, onClose }: {
  exp: ExpenseFromAPI;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function closeAndThen(action?: () => void) {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); action?.(); }, 300);
  }

  const date = new Date(exp.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div
        className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`}
        onClick={() => closeAndThen()}
      />
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.detailBody} ${revealed ? styles.detailRevealed : ''}`}>
          <div className={styles.detailHeader}>
            <span className={styles.detailTitle}>{exp.description}</span>
            <span className={styles.detailSub}>
              ${fmtAmt(parseFloat(exp.amount))} · {exp.category} · {date}
            </span>
          </div>
          <div className={styles.detailActionRow}>
            <button className={styles.detailActionEditBtn} onClick={() => closeAndThen(onEdit)}>
              <span className="material-symbols-outlined">edit</span>
              Editar
            </button>
            <button className={styles.detailActionDeleteBtn} onClick={() => closeAndThen(onDelete)}>
              <span className="material-symbols-outlined">delete</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
