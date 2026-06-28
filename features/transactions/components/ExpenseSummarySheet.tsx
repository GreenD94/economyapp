'use client';
import { useEffect, useState } from 'react';
import { apiGetBlob } from '../../core/utils/api.client';
import { useExpenseComparison, type CategoryDelta } from '../hooks/useExpenseComparison.hook';
import styles from '../styles/Transactions.module.css';
import { fmtAmt, fmtMonth } from '../transactions.types';

const TOP_N = 5;

function DeltaBadge({ delta_pct }: { delta_pct: number | null }) {
  if (delta_pct === null) return <span className={styles.summaryDeltaMuted}>Nuevo</span>;
  const pct = Math.round(Math.abs(delta_pct));
  return delta_pct > 0
    ? <span className={styles.summaryDeltaUp}>↑ {pct}%</span>
    : <span className={styles.summaryDeltaDown}>↓ {pct}%</span>;
}

function DeltaRow({ d, maxAmount }: { d: CategoryDelta; maxAmount: number }) {
  const currAmt = parseFloat(d.current);
  const prevAmt = parseFloat(d.previous);
  const currPct = maxAmount > 0 ? (currAmt / maxAmount) * 100 : 0;
  const prevPct = maxAmount > 0 ? (prevAmt / maxAmount) * 100 : 0;
  return (
    <div className={styles.summaryDeltaRow}>
      <div className={styles.summaryDeltaTop}>
        <span className={styles.summaryDeltaCategory}>{d.category}</span>
        <div className={styles.summaryDeltaRight}>
          <span className={styles.summaryDeltaAmount}>${fmtAmt(currAmt)}</span>
          <DeltaBadge delta_pct={d.delta_pct} />
        </div>
      </div>
      <div className={styles.summaryBarGroup}>
        <div className={styles.summaryBarTrack}>
          <div className={styles.summaryBarFillCurrent} style={{ width: `${currPct}%` }} />
        </div>
        <div className={styles.summaryBarTrack}>
          <div className={styles.summaryBarFillPrevious} style={{ width: `${prevPct}%` }} />
        </div>
      </div>
    </div>
  );
}

interface Props { month: string; onClose: () => void; }

export function ExpenseSummarySheet({ month, onClose }: Props) {
  const [closing,     setClosing]     = useState(false);
  const [revealed,    setRevealed]    = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { data, loading } = useExpenseComparison(month);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  }

  async function handleExport() {
    setDownloading(true);
    try {
      const blob = await apiGetBlob(`/api/v1/analytics/expenses/export/csv?month=${month}`);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `gastos_${month}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const topDeltas = data?.deltas.filter(d => parseFloat(d.current) > 0).slice(0, TOP_N) ?? [];
  const maxAmount = topDeltas.length > 0
    ? Math.max(...topDeltas.flatMap(d => [parseFloat(d.current), parseFloat(d.previous)]))
    : 0;

  return (
    <>
      <div
        className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`}
        onClick={close}
      />
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.detailBody} ${revealed ? styles.detailRevealed : ''}`}>
          <div className={styles.summarySheetHeader}>
            <span className={`${styles.detailTitle} ${styles.detailTitleSpend}`}>
              Gastos · {fmtMonth(month)}
            </span>
            <button className={styles.summaryExportIconBtn} onClick={handleExport} disabled={downloading} aria-label="Exportar CSV">
              <span className="material-symbols-outlined">{downloading ? 'hourglass_empty' : 'file_download'}</span>
            </button>
          </div>

          {loading && <p className={styles.loading}>Calculando...</p>}

          {topDeltas.length > 0 && (
            <>
              <p className={styles.summaryCompSection}>Vs. mes anterior</p>
              {topDeltas.map(d => <DeltaRow key={d.category} d={d} maxAmount={maxAmount} />)}
            </>
          )}
        </div>
      </div>
    </>
  );
}
