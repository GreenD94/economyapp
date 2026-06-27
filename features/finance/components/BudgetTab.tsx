'use client';
import { DotsMenu } from '@/features/core/components/DotsMenu.component';
import styles from '../styles/Finance.module.css';
import { fmtMonth, fmtAmt } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';

export function BudgetTab({ ctx }: { ctx: FinanceCtx }) {
  const {
    budgetHook, totalBudget, totalSpent, overallPct,
    setEditBudgetCat, setEditBudgetAmt,
    setBudgetDetail, openConfirmPay,
  } = ctx;

  return (
    <>
      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => budgetHook.setMonthOffset(budgetHook.monthOffset - 1)}>‹</button>
        <span className={styles.monthLabel}>{fmtMonth(budgetHook.month)}</span>
        <button className={styles.monthBtn} onClick={() => budgetHook.setMonthOffset(budgetHook.monthOffset + 1)}>›</button>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Presupuesto total</span>
          <span className={styles.summaryValue}>${fmtAmt(totalBudget)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Gastado</span>
          <span className={styles.summaryValue}>${fmtAmt(totalSpent)}</span>
        </div>
        <div className={styles.summaryBarWrap}>
          <div className={styles.summaryBarFill} style={{ width: `${overallPct * 100}%` }}>
            {overallPct >= 0.25 && <span className={styles.summaryBarLabel}>${totalSpent.toFixed(0)}</span>}
          </div>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Disponible</span>
          <span className={styles.summaryValue}>${fmtAmt(totalBudget - totalSpent)}</span>
        </div>
      </div>

      {budgetHook.loading && <div className={styles.loading}>Cargando...</div>}
      {budgetHook.error   && <div className={styles.error}>{budgetHook.error}</div>}

      <div className={styles.list}>
        {budgetHook.budgets.map(b => {
          const spent  = parseFloat(b.spent_this_month);
          const budget = parseFloat(b.monthly_amount);
          const pct    = budget > 0 ? Math.min(1, spent / budget) : 0;
          return (
            <div key={b.category} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{b.category}</span>
                <DotsMenu items={[
                  { label: 'Editar presupuesto', icon: 'edit', onClick: () => { setEditBudgetCat(b.category); setEditBudgetAmt(b.monthly_amount); } },
                ]} />
              </div>
              <div className={styles.miniBarWrap} onClick={() => setBudgetDetail(b)}>
                <div className={styles.miniBarFill} style={{ width: `${pct * 100}%` }}>
                  {pct >= 0.3 && <span className={styles.miniBarLabel}>${spent.toFixed(0)}</span>}
                </div>
              </div>
              {budget > 0 && spent === 0 && (
                <button className={styles.confirmPayBtn} onClick={() => openConfirmPay(b.category, b.monthly_amount)}>
                  <span className="material-symbols-outlined">check_circle</span>
                  Confirmar pago
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
