'use client';
import { SourceDetailSheet } from './SourceDetailSheet';
import { IncomeDetailSheet } from './IncomeDetailSheet';
import { getExpectedSlots } from '../transactions.utils';
import { useCountUp } from '../hooks/useCountUp.hook';
import styles from '../styles/Transactions.module.css';
import { fmtAmt, fmtMonth, FREQ_LABELS, type Frequency } from '../transactions.types';
import type { TransactionCtx } from '../hooks/useTransactions.hook';

export function IncomesTab({ ctx }: { ctx: TransactionCtx }) {
  const { incomeHook, sourcesHook, manualIncomes, totalExpected, totalConfirmed,
    setAddSourceOpen, setAddIncomeOpen,
    setEditIncome, setEditIncomeForm, setEditIncomeNote, setConfirm,
    sourceDetail, setSourceDetail,
    incomeDetail, setIncomeDetail } = ctx;

  const animExpected  = useCountUp(totalExpected,  750, 300);
  const animConfirmed = useCountUp(totalConfirmed, 750, 300);

  return (
    <>
      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => incomeHook.setMonthOffset(incomeHook.monthOffset - 1)}>‹</button>
        <span className={styles.monthLabel}>{fmtMonth(incomeHook.month)}</span>
        <button className={styles.monthBtn} onClick={() => incomeHook.setMonthOffset(incomeHook.monthOffset + 1)}>›</button>
      </div>

      <div key={incomeHook.month}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Esperado</span>
            <span className={styles.summaryValue}>${fmtAmt(animExpected)}</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Confirmado</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueEarn}`}>${fmtAmt(animConfirmed)}</span>
          </div>
        </div>

        {incomeHook.loading && <div className={styles.loading}>Cargando...</div>}
        {incomeHook.error   && <div className={styles.error}>{incomeHook.error}</div>}

        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Fuentes de ingreso</span>
          <button className={styles.sectionAddBtn} onClick={() => setAddSourceOpen(true)} aria-label="Agregar fuente">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.list}>
          {sourcesHook.sources.length === 0 && !sourcesHook.loading && (
            <p className={styles.empty}>Sin fuentes configuradas.</p>
          )}
          {sourcesHook.sources.map((src, i) => {
            const confirmedCount = incomeHook.incomes.filter(inc => inc.source_id === src.id).length;
            const slots = getExpectedSlots(src, incomeHook.month);
            const fillPct = Math.min(100, (confirmedCount / slots.length) * 100);
            return (
              <div key={src.id} className={`${styles.card} ${styles.sourceCard}`}
                style={{ '--i': i } as React.CSSProperties}
                onClick={() => setSourceDetail(src)} role="button" tabIndex={0}>
                <div className={styles.sourceCardFill} style={{ width: `${fillPct}%` }} />
                <div className={styles.sourceCardTop}>
                  <div className={styles.sourceCardInfo}>
                    <span className={styles.cardName}>{src.label}</span>
                    <div className={styles.cardSub}>
                      <span className={styles.chip}>{FREQ_LABELS[src.frequency as Frequency]}</span>
                      <span className={styles.chip}>{src.income_type === 'fixed' ? 'Siempre fijo' : 'Cambia cada mes'}</span>
                      {src.income_type === 'fixed' && src.base_amount && (
                        <span className={styles.chip}>${fmtAmt(parseFloat(src.monthly_equivalent))}/mes</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.sourceCardRight}>
                    {confirmedCount > 0 && confirmedCount < slots.length && (
                      <span className={styles.sourceCardProgressText}>{confirmedCount}/{slots.length}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Otros ingresos</span>
          <button className={styles.sectionAddBtn} onClick={() => setAddIncomeOpen(true)} aria-label="Agregar ingreso">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.list}>
          {manualIncomes.length === 0 && !incomeHook.loading && (
            <p className={styles.empty}>Sin ingresos adicionales este mes.</p>
          )}
          {manualIncomes.map((inc, i) => (
            <div key={inc.id} className={`${styles.card} ${styles.cardTappable}`}
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => setIncomeDetail(inc)} role="button" tabIndex={0}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{inc.source}</span>
                <span className={`${styles.cardAmount} ${styles.cardAmountEarn}`}>${fmtAmt(parseFloat(inc.amount))}</span>
              </div>
              <div className={styles.cardSub}>
                <span className={styles.chip}>{inc.type}</span>
                {inc.notes && <span>{inc.notes}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sourceDetail && (
        <SourceDetailSheet src={sourceDetail} ctx={ctx} onClose={() => setSourceDetail(null)} />
      )}
      {incomeDetail && (
        <IncomeDetailSheet
          inc={incomeDetail}
          onEdit={() => { setEditIncome(incomeDetail); setEditIncomeForm({ date: incomeDetail.date, source: incomeDetail.source, amount: incomeDetail.amount, type: incomeDetail.type }); setEditIncomeNote(''); }}
          onDelete={() => setConfirm({ msg: '¿Eliminar este ingreso?', action: () => incomeHook.deleteIncome(incomeDetail.id) })}
          onClose={() => setIncomeDetail(null)}
        />
      )}
    </>
  );
}
