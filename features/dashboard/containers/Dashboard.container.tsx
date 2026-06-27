'use client';
import styles from '../styles/Dashboard.module.css';
import { useDashboardUI } from '../hooks/useDashboardUI.hook';
import { SpendingPie }    from '../components/SpendingPie';
import { DashboardModals } from '../components/DashboardModals';
import { fmt, nowString } from '../dashboard.helpers';

export function DashboardContainer() {
  const ctx = useDashboardUI();
  const {
    loading, error,
    goal, current, target, pct, faltante,
    totalIncome, totalExpenses, disponible,
    expPct, adjTargetPct, availPct,
    slices,
    countCurrent, countFaltante, countDisponible,
    heroFillWidth, spendWidth, saveWidth, availWidth,
    setGoalOpen, setMesOpen, setInfoGoal, setInfoMes, setInfoCat,
  } = ctx;

  const savedFits  = pct > 25;
  const remainFits = (100 - pct) > 25;

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error)   return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>

      <div className={styles.heroWrap}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Meta de Ahorro</span>
          <button className={styles.infoBtn} onClick={() => setInfoGoal(true)} aria-label="Info">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
        <div className={styles.heroBar} onClick={() => setGoalOpen(true)} role="button" aria-label="Ver detalles">
          <div className={styles.heroFill} style={{ width: heroFillWidth }}>
            {savedFits && <span className={styles.heroLabelSaved}>{fmt(countCurrent)}</span>}
          </div>
          {!savedFits && (
            <span className={`${styles.heroLabelSaved} ${styles.heroLabelSavedOutside}`}>
              {fmt(countCurrent)}
            </span>
          )}
          {remainFits
            ? <span className={styles.heroLabelRemain}>{fmt(countFaltante)}</span>
            : <span className={`${styles.heroLabelRemain} ${styles.heroLabelRemainOutside}`}>{fmt(countFaltante)}</span>
          }
        </div>
        <span className={styles.heroTapHint}>Toca la barra para ver detalles</span>
      </div>

      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Mes Actual</span>
        <button className={styles.infoBtn} onClick={() => setInfoMes(true)} aria-label="Info">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
      <span className={styles.mesDateSubtitle}>{nowString()}</span>

      {totalIncome === 0 ? (
        <div className={styles.pendingCard}>
          <span className={styles.pendingIcon}><span className="material-symbols-outlined">pending_actions</span></span>
          <p className={styles.pendingMsg}>Aún no has confirmado ingresos este mes. ¿Ya recibiste alguno?</p>
          <a href="/transactions" className={styles.pendingBtn}>Ver mis ingresos</a>
        </div>
      ) : (
        <div className={styles.monthCard}>
          <span className={styles.mesLabel}>Disponible</span>
          <span className={styles.mesAmount}>{fmt(Math.max(0, countDisponible))}</span>
          {disponible < 0 && (
            <div className={styles.negativeBreakdown}>
              <div className={styles.negativeRow}>
                <span className={`material-symbols-outlined ${styles.negativeRowIcon}`}>savings</span>
                <span>Por ahorrar: {fmt(target)}</span>
              </div>
              <div className={styles.negativeRow}>
                <span className={`material-symbols-outlined ${styles.negativeRowIcon}`}>receipt_long</span>
                <span>Gastos registrados: {fmt(totalExpenses)}</span>
              </div>
              <div className={styles.negativeRow}>
                <span className={`material-symbols-outlined ${styles.negativeRowIcon}`}>info</span>
                <span>Te faltan {fmt(Math.abs(disponible))} de ingresos por confirmar.</span>
              </div>
            </div>
          )}
          <div className={styles.combBar} onClick={() => setMesOpen(true)} role="button" aria-label="Ver detalles del mes">
            {expPct > 0 && (
              <div className={styles.combSegSpend} style={{ width: spendWidth }}>
                {expPct >= 0.15 && <span className={styles.combLabel}>${totalExpenses.toFixed(0)}</span>}
              </div>
            )}
            {adjTargetPct > 0 && (
              <div className={styles.combSegSave} style={{ width: saveWidth }}>
                {adjTargetPct >= 0.15 && <span className={styles.combLabel}>${target.toFixed(0)}</span>}
              </div>
            )}
            {availPct > 0 && (
              <div className={styles.combSegAvail} style={{ width: availWidth }}>
                {availPct >= 0.15 && <span className={styles.combLabel}>${disponible.toFixed(0)}</span>}
              </div>
            )}
          </div>
          <span className={styles.tapHint}>Toca la barra para ver detalles</span>
        </div>
      )}

      <div>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Gastos por Categoría</span>
          <button className={styles.infoBtn} onClick={() => setInfoCat(true)} aria-label="Info">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
        <SpendingPie slices={slices} />
      </div>

      <DashboardModals ctx={ctx} />
    </div>
  );
}
