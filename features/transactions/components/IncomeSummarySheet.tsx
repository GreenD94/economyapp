'use client';
import { useEffect, useState } from 'react';
import { apiGetBlob } from '../../core/utils/api.client';
import { useIncomeInsight, type IncomeInsight } from '../hooks/useIncomeInsight.hook';
import styles from '../styles/Transactions.module.css';
import { fmtAmt, fmtMonth } from '../transactions.types';

function insightText(d: IncomeInsight): string {
  const confirmed = parseFloat(d.confirmed_amount);
  const expected  = parseFloat(d.expected_amount);
  const missing   = Math.max(0, expected - confirmed);
  if (d.total_sources === 0) return 'No tienes fuentes de ingreso configuradas.';
  if (d.confirmed_sources === 0)
    return `Aún no confirmaste ninguna fuente. Te esperan $${fmtAmt(expected)} este mes.`;
  if (d.confirmed_sources === d.total_sources)
    return `Confirmaste todas tus fuentes. Tu ingreso base este mes es $${fmtAmt(confirmed)}.`;
  return `Confirmaste ${d.confirmed_sources} de ${d.total_sources} fuentes. Te faltan $${fmtAmt(missing)} por confirmar.`;
}

interface Props { month: string; onClose: () => void; }

export function IncomeSummarySheet({ month, onClose }: Props) {
  const [closing,     setClosing]     = useState(false);
  const [revealed,    setRevealed]    = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { data, loading } = useIncomeInsight(month);

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
      const blob = await apiGetBlob(`/api/v1/analytics/incomes/export/csv?month=${month}`);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ingresos_${month}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div
        className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`}
        onClick={close}
      />
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.detailBody} ${revealed ? styles.detailRevealed : ''}`}>
          <div className={styles.summarySheetHeader}>
            <span className={styles.detailTitle}>Ingresos · {fmtMonth(month)}</span>
            <button className={styles.summaryExportIconBtn} onClick={handleExport} disabled={downloading} aria-label="Exportar CSV">
              <span className="material-symbols-outlined">{downloading ? 'hourglass_empty' : 'file_download'}</span>
            </button>
          </div>

          {loading && <p className={styles.loading}>Calculando...</p>}

          {data && (
            <p className={styles.summaryInsight}>{insightText(data)}</p>
          )}
        </div>
      </div>
    </>
  );
}
