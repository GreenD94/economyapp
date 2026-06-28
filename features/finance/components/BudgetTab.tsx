'use client';
import styles from '../styles/Finance.module.css';
import { fmtMonth } from '../finance.types';
import { MasterBudgetBar } from './MasterBudgetBar';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function BudgetTab({ ctx }: { ctx: FinanceCtx }) {
  const { budgetHook, setAddBudgetOpen, setBolsilloDetail } = ctx;

  return (
    <>
      <div className={styles.monthNav}>
        <button className={styles.monthBtn}
          onClick={() => budgetHook.setMonthOffset(budgetHook.monthOffset - 1)}>‹</button>
        <span className={styles.monthLabel}>{fmtMonth(budgetHook.month)}</span>
        <button className={styles.monthBtn}
          onClick={() => budgetHook.setMonthOffset(budgetHook.monthOffset + 1)}>›</button>
      </div>

      {budgetHook.loading && <div className={styles.loading}>Cargando...</div>}
      {budgetHook.error   && <div className={styles.error}>{budgetHook.error}</div>}

      <MasterBudgetBar ctx={ctx} />

      <div className={styles.bolsillosHeader}>
        <span className={styles.bolsillosTitle}>Bolsillos</span>
        <button className={styles.addBtnIcon} onClick={() => setAddBudgetOpen(true)}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {!budgetHook.loading && budgetHook.budgets.length === 0 && (
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined">category</span>
          <h3 className={styles.emptyStateTitle}>Sin bolsillos aún</h3>
          <p className={styles.emptyStateText}>
            Crea bolsillos para controlar cuánto gastas en cada categoría.
          </p>
          <button className={styles.emptyStateCta} onClick={() => setAddBudgetOpen(true)}>
            <span className="material-symbols-outlined">add</span>
            Crear primer bolsillo
          </button>
        </div>
      )}

      <div className={budgetHook.budgets.length > 0 ? styles.list : ''}>
        {budgetHook.budgets.map((b, idx) => {
          const spent  = parseFloat(b.spent_this_month);
          const budget = parseFloat(b.monthly_amount);
          const pct    = budget > 0 ? Math.min(1, spent / budget) : 0;
          return (
            <div key={b.category} className={styles.card}
              onClick={() => setBolsilloDetail(b)}
              role="button" tabIndex={0}
              style={{ '--i': idx } as React.CSSProperties}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{b.category}</span>
              </div>
              <div className={styles.miniBarWrap}>
                <div className={styles.miniBarFill} style={{ width: `${pct * 100}%` }}>
                  {pct >= 0.15 && <span className={styles.miniBarLabel}>${spent.toFixed(0)}</span>}
                </div>
              </div>
              <p className={styles.barHint}>Toca para ver detalles</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
