'use client';
import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions.hook';
import { IncomesTab } from '../components/IncomesTab';
import { ExpensesTab } from '../components/ExpensesTab';
import { SourceModals } from '../components/SourceModals';
import { IncomeModals } from '../components/IncomeModals';
import { ExpenseModals } from '../components/ExpenseModals';
import { ExpenseSourceModals } from '../components/ExpenseSourceModals';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import { InfoModal } from '@/features/core/components/InfoModal.component';
import { INFO } from '@/features/core/content/info.content';
import styles from '../styles/Transactions.module.css';
import type { Tab } from '../transactions.types';

const TAB_ORDER: Tab[] = ['incomes', 'expenses'];

export function TransactionsContainer() {
  const tx = useTransactions();
  const { activeTab, setActiveTab, confirm, setConfirm, infoIncomes, setInfoIncomes, infoExpenses, setInfoExpenses } = tx;

  const [slideClass, setSlideClass] = useState('');

  function handleTabSwitch(tab: Tab) {
    if (tab === activeTab) return;
    const dir = TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeTab) ? 'left' : 'right';
    setSlideClass(dir === 'left' ? styles.slideInLeft : styles.slideInRight);
    setActiveTab(tab);
  }

  const infoI = INFO.transactions.incomes;
  const infoG = INFO.transactions.expenses;

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'incomes' ? styles.tabActive : ''}`}
          onClick={() => handleTabSwitch('incomes')}>
          Ingresos
          <span role="button" className={styles.tabInfo} onClick={e => { e.stopPropagation(); setInfoIncomes(true); }}>
            <span className="material-symbols-outlined">info</span>
          </span>
        </button>
        <button className={`${styles.tab} ${activeTab === 'expenses' ? styles.tabActivePink : ''}`}
          onClick={() => handleTabSwitch('expenses')}>
          Gastos
          <span role="button" className={styles.tabInfo} onClick={e => { e.stopPropagation(); setInfoExpenses(true); }}>
            <span className="material-symbols-outlined">info</span>
          </span>
        </button>
      </div>

      <div key={activeTab} className={`${styles.tabContent} ${slideClass}`}
        onAnimationEnd={e => { if (e.target === e.currentTarget) setSlideClass(''); }}>
        {activeTab === 'incomes'  ? <IncomesTab  ctx={tx} /> : <ExpensesTab ctx={tx} />}
      </div>

      <SourceModals        ctx={tx} />
      <IncomeModals        ctx={tx} />
      <ExpenseModals       ctx={tx} />
      <ExpenseSourceModals ctx={tx} />

      {confirm && <ConfirmModal open={true} onClose={() => setConfirm(null)} onConfirm={confirm.action} message={confirm.msg} />}

      <InfoModal open={infoIncomes} onClose={() => setInfoIncomes(false)} title={infoI.title}
        howItWorks={<>{infoI.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoI.glossary} />
      <InfoModal open={infoExpenses} onClose={() => setInfoExpenses(false)} title={infoG.title}
        howItWorks={<>{infoG.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoG.glossary} />
    </div>
  );
}
