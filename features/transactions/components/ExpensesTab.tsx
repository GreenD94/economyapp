'use client';
import { useState } from 'react';
import { ExpenseDetailSheet } from './ExpenseDetailSheet';
import { ExpenseSourceDetailSheet } from './ExpenseSourceDetailSheet';
import { ExpenseFilterKeyboard } from './ExpenseFilterKeyboard';
import { FrequentExpensesSection } from './FrequentExpensesSection';
import { useCountUp } from '../hooks/useCountUp.hook';
import styles from '../styles/Transactions.module.css';
import { fmtAmt, fmtMonth } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

export function ExpensesTab({ ctx }: { ctx: TransactionCtx }) {
  const {
    expenseHook,
    expenseSourceDetail, setExpenseSourceDetail,
    totalExpectedExpenses, totalConfirmedExpenses, manualExpenses,
    setAddExpenseOpen,
    setEditExpense, setEditExpenseForm, setConfirm,
    expenseDetail, setExpenseDetail,
  } = ctx;
  const { categoryFilters, setCategoryFilters, typeFilters, setTypeFilters } = expenseHook;
  const [filterOpen, setFilterOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'category' | 'type' | null>(null);

  const animExpected  = useCountUp(totalExpectedExpenses,  750, 300);
  const animConfirmed = useCountUp(totalConfirmedExpenses, 750, 300);
  const hasFilter     = categoryFilters.length > 0 || typeFilters.length > 0;
  const allManualCount = expenseHook.allExpenses.filter(e => e.source_id === null).length;
  const manualLabel   = hasFilter
    ? `${manualExpenses.length} de ${allManualCount} ${allManualCount === 1 ? 'gasto' : 'gastos'}`
    : `${manualExpenses.length} ${manualExpenses.length === 1 ? 'gasto' : 'gastos'}`;

  function toggleFilter() { if (filterOpen) setPickerMode(null); setFilterOpen(o => !o); }
  function toggleCat(c: string) { setCategoryFilters(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); }
  function toggleType(t: string) { setTypeFilters(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]); }

  return (
    <>
      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => expenseHook.setMonthOffset(expenseHook.monthOffset - 1)}>‹</button>
        <span className={styles.monthLabel}>{fmtMonth(expenseHook.month)}</span>
        <button className={styles.monthBtn} onClick={() => expenseHook.setMonthOffset(expenseHook.monthOffset + 1)}>›</button>
      </div>

      <div key={expenseHook.month}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Esperado</span>
            <span className={styles.summaryValue}>${fmtAmt(animExpected)}</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Pagado</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueSpend}`}>${fmtAmt(animConfirmed)}</span>
          </div>
        </div>

        {/* Gastos frecuentes */}
        <FrequentExpensesSection ctx={ctx} />

        {/* Otros gastos */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Otros gastos <span className={styles.sectionCount}>{manualLabel}</span></span>
          <button className={`${styles.sectionAddBtn} ${styles.sectionAddBtnSpend}`}
            onClick={() => setAddExpenseOpen(true)} aria-label="Agregar gasto">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.filterBarRow}>
          <button className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
            onClick={toggleFilter} aria-label="Filtrar gastos">
            <span className="material-symbols-outlined">tune</span>
            {hasFilter && !filterOpen && <span className={styles.filterDot} />}
          </button>
          {hasFilter && (
            <button className={styles.filterBarClear}
              onClick={() => { setCategoryFilters([]); setTypeFilters([]); }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className={`${styles.filterPanel} ${filterOpen ? styles.filterPanelOpen : ''}`}>
          <div className={styles.filterPanelInner}>
            <button className={styles.filterQuestion} onClick={() => setPickerMode('category')}>
              <div className={styles.filterQuestionContent}>
                <span className={styles.filterQuestionText}>¿Buscar por categoría?</span>
                {categoryFilters.length > 0 && (
                  <div className={styles.filterQuestionSelected}>
                    {categoryFilters.map(c => <span key={c} className={styles.filterQuestionChip}>{c}</span>)}
                  </div>
                )}
              </div>
            </button>
            <button className={styles.filterQuestion} onClick={() => setPickerMode('type')}>
              <div className={styles.filterQuestionContent}>
                <span className={styles.filterQuestionText}>¿Buscar por clasificación?</span>
                {typeFilters.length > 0 && (
                  <div className={styles.filterQuestionSelected}>
                    {typeFilters.map(t => <span key={t} className={styles.filterQuestionChip}>{t}</span>)}
                  </div>
                )}
              </div>
            </button>
            {hasFilter && (
              <button className={styles.filterClearAll}
                onClick={() => { setCategoryFilters([]); setTypeFilters([]); }}>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        <div className={styles.list}>
          {manualExpenses.length === 0 && !expenseHook.loading && (
            <p className={styles.empty}>
              {hasFilter ? 'Sin gastos con estos filtros.' : 'Sin otros gastos este mes.'}
            </p>
          )}
          {manualExpenses.map((exp, i) => (
            <div key={exp.id} className={`${styles.card} ${styles.cardTappable}`}
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => setExpenseDetail(exp)} role="button" tabIndex={0}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{exp.description}</span>
                <span className={`${styles.cardAmount} ${styles.cardAmountSpend}`}>${fmtAmt(parseFloat(exp.amount))}</span>
              </div>
              <div className={styles.cardSub}>
                <span className={`${styles.chip} ${styles.chipGastos}`}>{exp.category}</span>
                <span className={`${styles.chip} ${styles.chipGastos}`}>{exp.type}</span>
                <span>{new Date(exp.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pickerMode && (
        <ExpenseFilterKeyboard mode={pickerMode}
          categoryFilters={categoryFilters} typeFilters={typeFilters}
          onToggleCat={toggleCat} onToggleType={toggleType} onClose={() => setPickerMode(null)} />
      )}

      {expenseSourceDetail && (
        <ExpenseSourceDetailSheet src={expenseSourceDetail} ctx={ctx} onClose={() => setExpenseSourceDetail(null)} />
      )}

      {expenseDetail && (
        <ExpenseDetailSheet exp={expenseDetail}
          onEdit={() => {
            setEditExpense(expenseDetail);
            setEditExpenseForm({ date: expenseDetail.date, category: expenseDetail.category, description: expenseDetail.description, amount: expenseDetail.amount, type: expenseDetail.type });
          }}
          onDelete={() => setConfirm({ msg: '¿Eliminar este gasto?', action: () => expenseHook.deleteExpense(expenseDetail.id) })}
          onClose={() => setExpenseDetail(null)} />
      )}
    </>
  );
}
