'use client';
import { useState } from 'react';
import { SrcFilterKeyboard } from './SrcFilterKeyboard';
import { getExpectedSlots } from '../transactions.utils';
import styles from '../styles/Transactions.module.css';
import { fmtAmt, FREQ_LABELS, type Frequency } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

export function FrequentExpensesSection({ ctx }: { ctx: TransactionCtx }) {
  const { expenseSourcesHook, expenseHook, setAddExpenseSourceOpen, confirmedExpenseEntries, setExpenseSourceDetail } = ctx;

  const [filterOpen,    setFilterOpen]    = useState(false);
  const [pickerMode,    setPickerMode]    = useState<'category' | 'classification' | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [classFilters,    setClassFilters]    = useState<string[]>([]);

  const hasFilter = categoryFilters.length > 0 || classFilters.length > 0;

  function toggleFilter() { if (filterOpen) setPickerMode(null); setFilterOpen(o => !o); }
  function toggleCat(c: string)   { setCategoryFilters(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); }
  function toggleClass(c: string) { setClassFilters(prev    => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); }

  const filtered = expenseSourcesHook.sources.filter(src =>
    (categoryFilters.length === 0 || categoryFilters.includes(src.category)) &&
    (classFilters.length    === 0 || classFilters.includes(src.classification))
  );

  return (
    <>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Gastos frecuentes</span>
        <button className={`${styles.sectionAddBtn} ${styles.sectionAddBtnSpend}`}
          onClick={() => setAddExpenseSourceOpen(true)} aria-label="Agregar gasto frecuente">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className={styles.filterBarRow}>
        <button className={`${styles.filterBtn} ${filterOpen ? styles.filterBtnActive : ''}`}
          onClick={toggleFilter} aria-label="Filtrar gastos frecuentes">
          <span className="material-symbols-outlined">tune</span>
          {hasFilter && !filterOpen && <span className={styles.filterDot} />}
        </button>
        {hasFilter && (
          <button className={styles.filterBarClear}
            onClick={() => { setCategoryFilters([]); setClassFilters([]); }}>
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
          <button className={styles.filterQuestion} onClick={() => setPickerMode('classification')}>
            <div className={styles.filterQuestionContent}>
              <span className={styles.filterQuestionText}>¿Buscar por clasificación?</span>
              {classFilters.length > 0 && (
                <div className={styles.filterQuestionSelected}>
                  {classFilters.map(c => <span key={c} className={styles.filterQuestionChip}>{c}</span>)}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {expenseSourcesHook.loading && <div className={styles.loading}>Cargando...</div>}
      <div className={styles.list}>
        {filtered.length === 0 && !expenseSourcesHook.loading && (
          <p className={styles.empty}>
            {hasFilter ? 'Sin gastos con estos filtros.' : 'Sin gastos frecuentes configurados.'}
          </p>
        )}
        {filtered.map((src, i) => {
          const confirmed = confirmedExpenseEntries(src.id);
          const slots     = getExpectedSlots(src, expenseHook.month);
          const fillPct   = slots.length > 0 ? Math.min(100, (confirmed.length / slots.length) * 100) : 0;
          const partial   = confirmed.length > 0 && confirmed.length < slots.length;
          return (
            <div key={src.id} className={`${styles.card} ${styles.sourceCard}`}
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => setExpenseSourceDetail(src)} role="button" tabIndex={0}>
              <div className={styles.sourceCardFillSpend} style={{ width: `${fillPct}%` }} />
              <div className={styles.sourceCardTop}>
                <div className={styles.sourceCardInfo}>
                  <span className={styles.cardName}>{src.label}</span>
                  <div className={styles.cardSub}>
                    <span className={`${styles.chip} ${styles.chipGastos}`}>{FREQ_LABELS[src.frequency as Frequency]}</span>
                    <span className={`${styles.chip} ${styles.chipGastos}`}>{src.classification}</span>
                    {src.base_amount && (
                      <span className={`${styles.chip} ${styles.chipGastos}`}>Ref: ${fmtAmt(parseFloat(src.base_amount))}</span>
                    )}
                  </div>
                </div>
                <div className={styles.sourceCardRight}>
                  {partial && <span className={styles.sourceCardProgressSpend}>{confirmed.length}/{slots.length}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pickerMode && (
        <SrcFilterKeyboard mode={pickerMode}
          categoryFilters={categoryFilters} classFilters={classFilters}
          onToggleCat={toggleCat} onToggleClass={toggleClass}
          onClose={() => setPickerMode(null)} />
      )}
    </>
  );
}
