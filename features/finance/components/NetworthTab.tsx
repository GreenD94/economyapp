'use client';
import { DotsMenu } from '@/features/core/components/DotsMenu.component';
import styles from '../styles/Finance.module.css';
import { fmtMonth, fmtAmt, NETWORTH_FILTER_LABELS, type NetworthFilter } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function NetworthTab({ ctx }: { ctx: FinanceCtx }) {
  const {
    networthHook, filteredEntries,
    networthFilter, setNetworthFilter,
    showNetworthFilter, setShowNetworthFilter,
    setAddNetworthOpen, setEditNetworth, setConfirm,
    currentSaved, monthsRemaining, goalAmount,
  } = ctx;

  return (
    <>
      <div className={styles.patriHeader}>
        <button
          className={`${styles.filterIconBtn} ${showNetworthFilter ? styles.filterIconBtnActive : ''}`}
          onClick={() => setShowNetworthFilter(v => !v)}
          aria-label="Filtrar"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
        <button className={styles.addBtnIcon} onClick={() => setAddNetworthOpen(true)} aria-label="Registrar mes">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {showNetworthFilter && (
        <div className={styles.filterChips}>
          {(['all', 'real', 'projected', 'meta'] as NetworthFilter[]).map(f => (
            <button key={f}
              className={`${styles.filterChip} ${networthFilter === f ? styles.filterChipActive : ''}`}
              onClick={() => setNetworthFilter(f)}>
              {NETWORTH_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      )}

      {goalAmount > 0 && currentSaved < goalAmount && monthsRemaining !== null && (
        <div className={styles.projectionBanner}>
          <span className="material-symbols-outlined">trending_up</span>
          <span>
            {`A este ritmo llegas a $${fmtAmt(goalAmount)} en `}
            <strong>{monthsRemaining === 1 ? '1 mes' : `${monthsRemaining} meses`}</strong>
          </span>
        </div>
      )}
      {goalAmount > 0 && currentSaved >= goalAmount && (
        <div className={`${styles.projectionBanner} ${styles.projectionBannerDone}`}>
          <span className="material-symbols-outlined">check_circle</span>
          <span><strong>¡Meta alcanzada!</strong> Llevas ${fmtAmt(currentSaved)} ahorrados.</span>
        </div>
      )}

      {networthHook.loading && <div className={styles.loading}>Cargando...</div>}
      {networthHook.error   && <div className={styles.error}>{networthHook.error}</div>}

      <div className={styles.list}>
        {filteredEntries.map((e, idx) => {
          const cardCls = e.goal_reached ? styles.patriGoal : e.is_actual ? styles.patriActual : styles.patriProjected;
          const badge   = e.is_actual ? 'Real' : e.goal_reached ? '¡Meta!' : 'Proyectado';
          return (
            <div key={`${e.month}-${idx}`} className={`${styles.patriCard} ${cardCls}`}>
              <div className={styles.patriTop}>
                <span className={styles.patriMonth}>{fmtMonth(e.month)}</span>
                <div className={styles.patriTopRight}>
                  <span className={styles.patriBadge}>{badge}</span>
                  {e.is_actual && e.id !== null && (
                    <DotsMenu items={[
                      { label: 'Editar', icon: 'edit', onClick: () => setEditNetworth({ id: e.id as number, month: e.month, amount: e.amount, notes: '' }) },
                      { label: 'Eliminar', icon: 'delete', danger: true, onClick: () => setConfirm({ msg: '¿Eliminar este registro?', action: () => networthHook.deleteEntry(e.id as number) }) },
                    ]} />
                  )}
                </div>
              </div>
              <span className={styles.patriAmount}>
                ${fmtAmt(parseFloat(e.amount))}
              </span>
              {e.growth && <span className={styles.patriGrowth}>+${parseFloat(e.growth).toFixed(2)}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}
