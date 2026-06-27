'use client';
import { useState } from 'react';
import { useBudget } from '../hooks/useBudget.hook';
import { useCountUp } from '@/features/core/hooks/useCountUp.hook';
import { Modal } from '@/features/core/components/Modal.component';
import { ConfirmModal } from '@/features/core/components/ConfirmModal.component';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import styles from '../styles/Budget.module.css';
import modalStyles from '@/features/core/components/Modal.module.css';

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' });
}

export function BudgetContainer() {
  const {
    budgets, monthlyIncome, monthlySavingsTarget,
    loading, error, month, monthOffset, setMonthOffset,
    updateBudget, deleteBudget, createBudget,
  } = useBudget();

  const [addOpen, setAddOpen] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const totalBudget = budgets.reduce((s, b) => s + parseFloat(b.monthly_amount), 0);
  const totalSpent  = budgets.reduce((s, b) => s + parseFloat(b.spent_this_month), 0);
  const countBudget = useCountUp(loading ? 0 : totalBudget, 2000);
  const countSpent  = useCountUp(loading ? 0 : totalSpent,  2000);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    setAddLoading(true);
    try {
      await createBudget(newCat.trim(), parseFloat(newAmount) || 0);
      setNewCat('');
      setNewAmount('');
      setAddOpen(false);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteBudget(deleteTarget);
    setDeleteTarget(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>PRESUPUESTO MENSUAL</div>

      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset - 1)}>&#8249;</button>
        <span className={styles.monthLabel}>{fmtMonth(month)}</span>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset + 1)}>&#8250;</button>
      </div>

      {monthlySavingsTarget > 0 && (
        <div className={styles.alert}>
          El día que cobres: mueve ${monthlySavingsTarget.toLocaleString()} a otra cuenta ANTES de gastar nada.
        </div>
      )}

      {loading && <div className={styles.loading}>Cargando...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Categoria</th><th>Presupuesto</th><th>Gastado</th><th>Diferencia</th><th></th></tr>
          </thead>
          <tbody>
            {budgets.map((b) => {
              const diff = parseFloat(b.remaining);
              return (
                <tr key={b.category}>
                  <td>{b.category}</td>
                  <td>${parseFloat(b.monthly_amount).toFixed(2)}</td>
                  <td className={styles.spendCell}>${parseFloat(b.spent_this_month).toFixed(2)}</td>
                  <td className={diff >= 0 ? styles.positive : styles.negative}>${diff.toFixed(2)}</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget(b.category)}
                      aria-label={`Eliminar ${b.category}`}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr className={styles.totalRow}>
              <td>TOTAL INGRESOS</td>
              <td>${countBudget.toFixed(2)}</td>
              <td className={styles.spendCell}>${countSpent.toFixed(2)}</td>
              <td>${(monthlyIncome - totalBudget).toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className={styles.addBtn} onClick={() => setAddOpen(true)}>
        <span className="material-symbols-outlined">add</span>
        Agregar categoría
      </button>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nueva categoría">
        <form onSubmit={handleAdd}>
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>Nombre</label>
            <input
              className={modalStyles.formInput}
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="Ej: Transporte"
              required
              autoFocus
            />
          </div>
          <div className={modalStyles.formField}>
            <label className={modalStyles.formLabel}>Presupuesto mensual</label>
            <MoneyInput fullWidth value={parseFloat(newAmount) || 0} onChange={v => setNewAmount(String(v))} />
          </div>
          {addError && <p style={{ color: 'var(--c-red-border)', fontSize: 'var(--font-size-sm)' }}>{addError}</p>}
          <div className={modalStyles.formActions}>
            <button type="button" className={modalStyles.secondaryBtn} onClick={() => setAddOpen(false)}>Cancelar</button>
            <button type="submit" className={modalStyles.submitBtn} disabled={addLoading}>
              {addLoading ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        message={`¿Eliminar la categoría "${deleteTarget}"? Se perderá la configuración de presupuesto pero no los gastos registrados.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
