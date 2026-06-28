'use client';
import { useState } from 'react';
import { HourMinuteInput } from './HourMinuteInput.component';
import styles from './DateTimePicker.module.css';

type Mode = 'chips' | 'picking' | 'confirmed';

function daysAgoISO(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function setDatePart(iso: string, dateOnly: string) {
  const [y, m, day] = dateOnly.split('-').map(Number);
  const prev = new Date(iso);
  return new Date(y, m - 1, day, prev.getHours(), prev.getMinutes(), 0).toISOString();
}
function setTimePart(iso: string, hour: number, minute: number) {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0).toISOString();
}
function formatDisplay(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${date} · ${h}:${m}`;
}

function currentMonthStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

type Props = {
  value: string;
  onChange: (iso: string) => void;
  label?: string;
  variant?: 'spend' | 'earn';
  month?: string;
};

export function DateTimePicker({ value, onChange, label = '¿Cuándo?', variant, month }: Props) {
  const skipChips = month != null && month !== currentMonthStr();
  const [mode,  setMode]  = useState<Mode>(skipChips ? 'picking' : 'chips');
  const [draft, setDraft] = useState(value);

  function selectChip(iso: string) {
    onChange(iso);
    setMode('chips');
  }

  function openPicking() {
    setDraft(value);
    setMode('picking');
  }

  function confirmPicking() {
    onChange(draft);
    setMode('confirmed');
  }

  function cancelConfirmed() {
    setMode('picking');
  }

  function cancelPicking() {
    setMode('chips');
  }

  const draftDate = new Date(draft);

  /* ── CONFIRMED: show text + cancel ── */
  if (mode === 'confirmed') {
    return (
      <div className={styles.wrap}>
        <span className={styles.label}>{label}</span>
        <div className={styles.confirmedDisplay}>
          <span className="material-symbols-outlined">calendar_today</span>
          <span>{formatDisplay(value)}</span>
        </div>
        <button className={styles.cancelBtn} onClick={cancelConfirmed}>Cancelar</button>
      </div>
    );
  }

  /* ── PICKING: date + time row, then confirm / cancel ── */
  if (mode === 'picking') {
    return (
      <div className={styles.wrap}>
        <span className={styles.label}>{label}</span>
        <div className={styles.pickingRow}>
          <input
            className={styles.dateInput}
            type="date"
            value={draft.slice(0, 10)}
            onChange={e => setDraft(setDatePart(draft, e.target.value))}
          />
          <HourMinuteInput
            hour={draftDate.getHours()}
            minute={draftDate.getMinutes()}
            onChange={(h, m) => setDraft(setTimePart(draft, h, m))}
            variant={variant}
          />
        </div>
        <button className={styles.confirmBtn} onClick={confirmPicking}>Confirmar</button>
        {!skipChips && (
          <button className={styles.cancelBtn} onClick={cancelPicking}>Cancelar</button>
        )}
      </div>
    );
  }

  /* ── CHIPS: Hoy / Ayer / Hace 2 días / Otra fecha ── */
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.chips}>
        {['Hoy', 'Ayer', 'Hace 2 días'].map((chip, i) => {
          const val = daysAgoISO(i);
          const active = value.slice(0, 10) === val.slice(0, 10);
          return (
            <button key={chip}
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => selectChip(val)}>
              {chip}
            </button>
          );
        })}
        <button className={styles.chipOther} onClick={openPicking}>
          Otra fecha
        </button>
      </div>
    </div>
  );
}
