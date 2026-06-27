'use client';
import { Modal }     from '@/features/core/components/Modal.component';
import { InfoModal } from '@/features/core/components/InfoModal.component';
import { INFO }      from '@/features/core/content/info.content';
import styles from '../styles/Dashboard.module.css';
import { fmt } from '../dashboard.helpers';
import type { DashboardCtx } from '../hooks/useDashboardUI.hook';

export function DashboardModals({ ctx }: { ctx: DashboardCtx }) {
  const {
    goalOpen, setGoalOpen, mesOpen, setMesOpen,
    infoGoal, setInfoGoal, infoMes, setInfoMes, infoCat, setInfoCat,
    goal, current, target, pct, faltante, meses,
    totalIncome, totalExpenses, disponible,
  } = ctx;

  const infoG = INFO.dashboard.goal;
  const infoM = INFO.dashboard.mesActual;
  const infoC = INFO.dashboard.categorias;

  return (
    <>
      <Modal open={goalOpen} onClose={() => setGoalOpen(false)} title="Detalle de Meta">
        <div className={styles.detailRow}><span className={styles.detailLabel}>Meta total</span><span className={styles.detailValue}>{fmt(goal)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Ahorro acumulado</span><span className={styles.detailValue}>{fmt(current)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Faltante</span><span className={styles.detailValue}>{fmt(faltante)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>% Completado</span><span className={styles.detailValue}>{pct.toFixed(1)}%</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Ahorro mensual objetivo</span><span className={styles.detailValue}>{fmt(target)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Meses restantes</span><span className={styles.detailValue}>{meses} meses</span></div>
      </Modal>

      <Modal open={mesOpen} onClose={() => setMesOpen(false)} title="Detalle del Mes">
        <div className={styles.detailRow}><span className={styles.detailLabel}>Ingresos del mes</span><span className={styles.detailValue}>{fmt(totalIncome)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Gastos del mes</span><span className={`${styles.detailValue} ${styles.detailValueSpend}`}>{fmt(totalExpenses)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Ahorro objetivo</span><span className={styles.detailValue}>{fmt(target)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Disponible</span><span className={styles.detailValue}>{fmt(disponible)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>% Gastado de ingresos</span><span className={styles.detailValue}>{totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0.0'}%</span></div>
      </Modal>

      <InfoModal open={infoGoal} onClose={() => setInfoGoal(false)} title={infoG.title}
        howItWorks={<>{infoG.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoG.glossary} />
      <InfoModal open={infoMes} onClose={() => setInfoMes(false)} title={infoM.title}
        howItWorks={<>{infoM.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoM.glossary} />
      <InfoModal open={infoCat} onClose={() => setInfoCat(false)} title={infoC.title}
        howItWorks={<>{infoC.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>} glossary={infoC.glossary} />
    </>
  );
}
