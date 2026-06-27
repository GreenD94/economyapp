'use client';
import { useState } from 'react';
import { useExpenses, CATEGORIES } from '../hooks/useExpenses.hook';
import styles from '../styles/Expenses.module.css';

function today() { return new Date().toISOString().slice(0, 10); }

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' });
}

export function ExpensesContainer() {
  const { expenses, loading, error, month, monthOffset, setMonthOffset, categoryFilters, setCategoryFilters, addExpense, deleteExpense } = useExpenses();
  const categoryFilter = categoryFilters[0] ?? null;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), category: 'Alimentacion', description: '', amount: '', type: 'Necesidad' });

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addExpense({ source_id: null, date: form.date, category: form.category, description: form.description, amount: form.amount, type: form.type });
    setForm({ date: today(), category: 'Alimentacion', description: '', amount: '', type: 'Necesidad' });
    setShowForm(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>REGISTRO DE GASTOS</div>

      <div className={styles.monthNav}>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset - 1)}>&#8249;</button>
        <span className={styles.monthLabel}>{fmtMonth(month)}</span>
        <button className={styles.monthBtn} onClick={() => setMonthOffset(monthOffset + 1)}>&#8250;</button>
      </div>

      <div className={styles.chips}>
        <button className={`${styles.chip} ${!categoryFilter ? styles.chipActive : ''}`} onClick={() => setCategoryFilters([])}>Todos</button>
        {CATEGORIES.map((c) => (
          <button key={c} className={`${styles.chip} ${categoryFilter === c ? styles.chipActive : ''}`} onClick={() => setCategoryFilters(c === categoryFilter ? [] : [c])}>{c}</button>
        ))}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>Agregar gasto</div>
          <input className={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <select className={styles.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input className={styles.input} placeholder="Descripcion" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input className={styles.input} type="number" step="0.01" placeholder="Monto" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <select className={styles.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Necesidad</option><option>Calidad de vida</option><option>Productividad</option><option>Capricho</option>
          </select>
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
            <tr><th>Fecha</th><th>Categoria</th><th>Descripcion</th><th>Monto</th><th>Tipo</th><th></th></tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>${parseFloat(e.amount).toFixed(2)}</td>
                <td>{e.type}</td>
                <td><button className={styles.deleteBtn} onClick={() => deleteExpense(e.id)}>✕</button></td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td colSpan={3}>TOTAL</td>
              <td>${total.toFixed(2)}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className={styles.fab} onClick={() => setShowForm(!showForm)}>+</button>
    </div>
  );
}
