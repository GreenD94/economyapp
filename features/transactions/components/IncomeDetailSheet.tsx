'use client';
import { useState, useEffect } from 'react';
import { fmtAmt } from '../transactions.types';
import styles from '../styles/Transactions.module.css';
import type { IncomeFromAPI } from '@/features/core/types/api.types';

export function IncomeDetailSheet({ inc, onEdit, onDelete, onClose }: {
  inc: IncomeFromAPI;
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

  return (
    <>
      <div
        className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`}
        onClick={() => closeAndThen()}
      />
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.detailBody} ${revealed ? styles.detailRevealed : ''}`}>
        <div className={styles.detailHeader}>
          <span className={styles.detailTitle}>{inc.source}</span>
          <span className={styles.detailSub}>${fmtAmt(parseFloat(inc.amount))}</span>
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
