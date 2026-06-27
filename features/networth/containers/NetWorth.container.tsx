'use client';
import { useState } from 'react';
import { useNetWorth } from '../hooks/useNetWorth.hook';
import styles from '../styles/NetWorth.module.css';

function fmtMonthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' });
}

function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function NetWorthContainer() {
  const { entries, loading, error, addEntry } = useNetWorth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ month: firstOfMonth(), amount: '', notes: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addEntry({ month: form.month, amount: parseFloat(form.amount), notes: form.notes || undefined });
    setShowForm(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>PATRIMONIO MES A MES</div>

      <div className={styles.alert}>
        Actualiza tu ahorro real cada mes. Las proyecciones se recalculan automaticamente.
      </div>

      <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
        + Registrar mes actual
      </button>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>Registrar ahorro real</div>
          <input className={styles.input} type="date" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} required />
          <input className={styles.input} type="number" step="0.01" placeholder="Ahorro real ($)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <input className={styles.input} placeholder="Notas (opcional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>Guardar</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {loading && <div className={styles.loading}>Cargando...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Mes</th><th>Patrimonio</th><th>Crecimiento</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const rowClass = e.goal_reached ? styles.goalRow : e.is_actual ? styles.actualRow : styles.projectedRow;
              return (
                <tr key={`${e.month}-${i}`} className={rowClass}>
                  <td>{fmtMonthLabel(e.month)}</td>
                  <td>${parseFloat(e.amount).toFixed(2)}</td>
                  <td>{e.growth ? `+$${parseFloat(e.growth).toFixed(2)}` : '—'}</td>
                  <td>
                    {e.is_actual
                      ? <span className={styles.statusBadge}>Real</span>
                      : <span className={styles.projBadge}>Proyectado</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
