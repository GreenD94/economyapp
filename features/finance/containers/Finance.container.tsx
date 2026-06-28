'use client';
import styles from '../styles/Finance.module.css';
import { useFinance }    from '../hooks/useFinance.hook';
import { BudgetTab }     from '../components/BudgetTab';
import { NetworthTab }   from '../components/NetworthTab';
import { FinanceModals } from '../components/FinanceModals';

export function FinanceContainer() {
  const ctx = useFinance();
  const { activeTab, setActiveTab, setInfoBudget, setInfoNetworth } = ctx;

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'budget' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('budget')}>
          Presupuesto
          <span role="button" tabIndex={0} className={styles.tabInfo}
            onClick={e => { e.stopPropagation(); setInfoBudget(true); }}
            onKeyDown={e => e.key === 'Enter' && setInfoBudget(true)}>
            <span className="material-symbols-outlined">info</span>
          </span>
        </button>
        <button className={`${styles.tab} ${activeTab === 'networth' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('networth')}>
          Patrimonio
          <span role="button" tabIndex={0} className={styles.tabInfo}
            onClick={e => { e.stopPropagation(); setInfoNetworth(true); }}
            onKeyDown={e => e.key === 'Enter' && setInfoNetworth(true)}>
            <span className="material-symbols-outlined">info</span>
          </span>
        </button>
      </div>

      {activeTab === 'budget'   && <BudgetTab   ctx={ctx} />}
      {activeTab === 'networth' && <NetworthTab  ctx={ctx} />}

      <FinanceModals ctx={ctx} />
    </div>
  );
}
