'use client';
import { MoneyInput } from '@/features/core/components/MoneyInput.component';
import modalStyles from '@/features/core/components/Modal.module.css';
import type { FormState } from '../wishlist.types';

export function ItemForm({ form, onChange, onSubmit, onCancel, title }: {
  form: FormState;
  onChange: (f: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
}) {
  return (
    <>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Qué quieres comprar?</label>
        <input className={modalStyles.formInput} placeholder="ej. Audífonos" value={form.item}
          onChange={e => onChange({ ...form, item: e.target.value })} />
      </div>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Cuánto cuesta?</label>
        <MoneyInput fullWidth value={parseFloat(form.price) || 0} onChange={v => onChange({ ...form, price: String(v) })} />
      </div>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>¿Qué tan prioritario es?</label>
        <select className={modalStyles.formSelect} value={form.priority} onChange={e => onChange({ ...form, priority: e.target.value })}>
          <option>Alta</option><option>Media</option><option>Baja</option>
        </select>
      </div>
      <div className={modalStyles.formField}>
        <label className={modalStyles.formLabel}>Notas (opcional)</label>
        <input className={modalStyles.formInput} placeholder="Notas..." value={form.notes}
          onChange={e => onChange({ ...form, notes: e.target.value })} />
      </div>
      <div className={modalStyles.formActions}>
        <button type="button" className={modalStyles.secondaryBtn} onClick={onCancel}>Cancelar</button>
        <button type="button" className={modalStyles.submitBtn} onClick={onSubmit}>{title}</button>
      </div>
    </>
  );
}
