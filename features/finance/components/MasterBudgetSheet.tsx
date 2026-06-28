'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Finance.module.css';
import { fmtAmt } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

type Props = { ctx: FinanceCtx; onClose: () => void };

export function MasterBudgetSheet({ ctx, onClose }: Props) {
  const router = useRouter();
  const [closing,  setClosing]  = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { spendingCap, totalRealExpenses } = ctx;
  const remaining = spendingCap - totalRealExpenses;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function close() { setClosing(true); setTimeout(onClose, 300); }

  return (
    <div className={styles.sheetBackdrop} onClick={close}>
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}
        onClick={e => e.stopPropagation()}>
        <div className={`${styles.sheetBody} ${revealed ? styles.sheetRevealed : ''}`}>
          <div className={styles.sheetHandle} />
          <h3 className={styles.sheetTitle}>Presupuesto del mes</h3>

          <div className={styles.masterSheetRow}>
            <span className={styles.masterSheetLabel}>Máximo para gastos</span>
            <span className={styles.masterSheetValue}>${fmtAmt(spendingCap)}</span>
          </div>
          <div className={styles.masterSheetRow}>
            <span className={styles.masterSheetLabel}>Gastado este mes</span>
            <span className={`${styles.masterSheetValue} ${styles.masterSheetSpend}`}>
              ${fmtAmt(totalRealExpenses)}
            </span>
          </div>
          <div className={styles.masterSheetRow}>
            <span className={styles.masterSheetLabel}>{remaining >= 0 ? 'Restante' : 'Excedido'}</span>
            <span className={`${styles.masterSheetValue} ${remaining >= 0 ? styles.masterSheetAvail : styles.masterSheetOver}`}>
              {remaining >= 0 ? `$${fmtAmt(remaining)}` : `−$${fmtAmt(Math.abs(remaining))}`}
            </span>
          </div>

          <button className={styles.masterSheetSettingsBtn}
            onClick={() => { close(); setTimeout(() => router.push('/settings'), 310); }}>
            <span className="material-symbols-outlined">edit</span>
            Editar presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}
