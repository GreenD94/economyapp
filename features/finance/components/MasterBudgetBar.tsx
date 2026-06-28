'use client';
import { useState } from 'react';
import styles from '../styles/Finance.module.css';
import { fmtAmt } from '../finance.types';
import { MasterBudgetSheet } from './MasterBudgetSheet';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function MasterBudgetBar({ ctx }: { ctx: FinanceCtx }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { spendingCap, totalRealExpenses } = ctx;

  const pct = spendingCap > 0 ? Math.min(1, totalRealExpenses / spendingCap) : 0;

  return (
    <div className={styles.masterWrap}>
      <div className={styles.masterBar}
        onClick={() => setSheetOpen(true)} role="button" tabIndex={0}>
        <div className={styles.masterBarFill} style={{ width: `${pct * 100}%` }}>
          {pct >= 0.15 && (
            <span className={styles.masterBarLabel}>${fmtAmt(totalRealExpenses)}</span>
          )}
        </div>
        {pct < 0.85 && (
          <span className={styles.masterBarMax}>${fmtAmt(spendingCap)}</span>
        )}
      </div>
      <div className={styles.masterMeta}>
        <span className={styles.masterHint}>Toca para ver detalles</span>
      </div>
      {sheetOpen && <MasterBudgetSheet ctx={ctx} onClose={() => setSheetOpen(false)} />}
    </div>
  );
}
