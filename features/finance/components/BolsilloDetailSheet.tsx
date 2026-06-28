'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/Finance.module.css';
import { fmtAmt } from '../finance.types';
import type { FinanceCtx } from '../hooks/useFinance.hook';
import type { BudgetFromAPI } from '@/features/core/types/api.types';

type Props = { bolsillo: BudgetFromAPI; ctx: FinanceCtx; onClose: () => void };

export function BolsilloDetailSheet({ bolsillo, ctx, onClose }: Props) {
  const [closing,  setClosing]  = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { budgetHook, setEditBudgetCat, setEditBudgetAmt, deleteBudget, setConfirm, openConfirmPay } = ctx;
  const expenses = budgetHook.allExpenses.filter(e => e.category === bolsillo.category);
  const spent  = parseFloat(bolsillo.spent_this_month);
  const budget = parseFloat(bolsillo.monthly_amount);
  const remain = parseFloat(bolsillo.remaining);
  const pct    = budget > 0 ? (spent / budget) * 100 : 0;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function close() { setClosing(true); setTimeout(onClose, 300); }

  function handleEdit() {
    close();
    setTimeout(() => {
      setEditBudgetCat(bolsillo.category);
      setEditBudgetAmt(bolsillo.monthly_amount);
    }, 310);
  }

  function handleDelete() {
    close();
    setTimeout(() => setConfirm({
      msg: `¿Eliminar el bolsillo "${bolsillo.category}"? Se perderá la configuración pero no los gastos registrados.`,
      action: () => deleteBudget(bolsillo.category),
    }), 310);
  }

  return (
    <div className={styles.sheetBackdrop} onClick={close}>
      <div className={`${styles.detailSheet} ${closing ? styles.detailSheetClosing : ''}`}
        onClick={e => e.stopPropagation()}>
        <div className={`${styles.sheetBody} ${revealed ? styles.sheetRevealed : ''}`}>
          <div className={styles.sheetHandle} />
          <h3 className={styles.sheetTitle}>{bolsillo.category}</h3>

          <div className={styles.bolsilloStats}>
            <div className={styles.bolsilloStat}>
              <span className={styles.bolsilloStatLabel}>Límite</span>
              <span className={styles.bolsilloStatValue}>${fmtAmt(budget)}</span>
            </div>
            <div className={styles.bolsilloStat}>
              <span className={styles.bolsilloStatLabel}>Gastado</span>
              <span className={`${styles.bolsilloStatValue} ${styles.bolsilloStatSpend}`}>${fmtAmt(spent)}</span>
            </div>
            <div className={styles.bolsilloStat}>
              <span className={styles.bolsilloStatLabel}>{remain >= 0 ? 'Restante' : 'Excedido'}</span>
              <span className={`${styles.bolsilloStatValue} ${remain >= 0 ? styles.bolsilloStatAvail : styles.bolsilloStatOver}`}>
                {remain >= 0 ? `$${fmtAmt(remain)}` : `−$${fmtAmt(Math.abs(remain))}`}
              </span>
            </div>
            <div className={styles.bolsilloStat}>
              <span className={styles.bolsilloStatLabel}>% Usado</span>
              <span className={styles.bolsilloStatValue}>{pct.toFixed(0)}%</span>
            </div>
          </div>

          <p className={styles.bolsilloExpenseTitle}>
            {expenses.length === 0
              ? 'Sin gastos este mes'
              : `${expenses.length} ${expenses.length === 1 ? 'gasto' : 'gastos'} este mes`}
          </p>
          <div className={styles.bolsilloExpenseList}>
            {expenses.map(exp => (
              <div key={exp.id} className={styles.bolsilloExpenseRow}>
                <div className={styles.bolsilloExpenseLeft}>
                  <span className={styles.bolsilloExpenseName}>{exp.description}</span>
                  <span className={styles.bolsilloExpenseDate}>
                    {new Date(exp.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <span className={styles.bolsilloExpenseAmt}>${fmtAmt(parseFloat(exp.amount))}</span>
              </div>
            ))}
          </div>

          <div className={styles.bolsilloActions}>
            {spent === 0 && budget > 0 && (
              <button className={styles.confirmPayBtn}
                onClick={() => { close(); setTimeout(() => openConfirmPay(bolsillo.category, bolsillo.monthly_amount), 310); }}>
                <span className="material-symbols-outlined">check_circle</span>
                Confirmar pago
              </button>
            )}
            <button className={styles.bolsilloEditBtn} onClick={handleEdit}>
              <span className="material-symbols-outlined">edit</span>
              Editar presupuesto
            </button>
            <button className={styles.bolsilloDeleteBtn} onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
              Eliminar bolsillo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
