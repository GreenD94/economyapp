'use client';
import { useState } from 'react';
import { useIncomes } from '../hooks/useIncomes.hook';
import styles from '../styles/Incomes.module.css';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleString('es', { month: 'long', year: 'numeric' });
}

export function IncomesContainer() {
  const { incomes, loading, error, month, monthOffset, setMonthOffset, addIncome, deleteIncome } = useIncomes();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), source: '', amount: '', type: 'Fijo', notes: '' });

  const total = incomes.reduce((s, i) => s + parseFloat(i.amount), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addIncome({ date: form.date, source: form.source, amount: form.amount, type: form.type, notes: form.notes || null });
    setForm({ date: today(), source: '', amount: '', type: 'Fijo', notes: '' });
    setShowForm(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>REGISTRO DE INGRESOS</div>

      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset - 1)}>&#8249;</button>
        <span className={styles.monthLabel}>{fmtMonth(month)}</span>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset + 1)}>&#8250;</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>Agregar ingreso</div>
          <input className={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <input className={styles.input} placeholder="Fuente" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} required />
          <input className={styles.input} type="number" step="0.01" placeholder="Monto" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <select className={styles.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Fijo</option><option>Variable</option><option>Extra</option>
          </select>
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
            <tr><th>Fecha</th><th>Fuente</th><th>Monto</th><th>Tipo</th><th>Notas</th><th></th></tr>
          </thead>
          <tbody>
            {incomes.map((i) => (
              <tr key={i.id}>
                <td>{i.date}</td>
                <td>{i.source}</td>
                <td>${parseFloat(i.amount).toFixed(2)}</td>
                <td>{i.type}</td>
                <td>{i.notes ?? '—'}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => deleteIncome(i.id)} title="Eliminar">✕</button>
                </td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td colSpan={2}>TOTAL</td>
              <td>${total.toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className={styles.fab} onClick={() => setShowForm(!showForm)} title="Agregar ingreso">+</button>
    </div>
  );
}
