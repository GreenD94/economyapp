'use client';
import { useState } from 'react';
import { NumericKeyboard } from './NumericKeyboard.component';
import styles from './HourMinuteInput.module.css';

type Props = {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  variant?: 'spend' | 'earn';
};

function pad(n: number) { return String(n).padStart(2, '0'); }
function clampH(n: number) { return Math.min(23, Math.max(0, n)); }
function clampM(n: number) { return Math.min(59, Math.max(0, n)); }

export function HourMinuteInput({ hour, minute, onChange, variant }: Props) {
  const [hDigits, setHDigits] = useState(pad(hour));
  const [mDigits, setMDigits] = useState(pad(minute));
  const [active,  setActive]  = useState<'h' | 'm' | null>(null);

  function openHour()   { setHDigits(pad(hour));   setActive('h'); }
  function openMinute() { setMDigits(pad(minute));  setActive('m'); }

  function handleDigit(d: string) {
    if (active === 'h') {
      setHDigits(prev => {
        const next = prev.length >= 2 ? d : prev.replace(/^0+/, '') + d;
        return parseInt(next) > 23 ? d : next;
      });
    } else {
      setMDigits(prev => {
        const next = prev.length >= 2 ? d : prev.replace(/^0+/, '') + d;
        return parseInt(next) > 59 ? d : next;
      });
    }
  }

  function handleBackspace() {
    if (active === 'h') setHDigits(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    else                setMDigits(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }

  function handleDone() {
    if (active === 'h') {
      const h = clampH(parseInt(hDigits) || 0);
      setHDigits(pad(h));
      onChange(h, clampM(parseInt(mDigits) || 0));
      setActive('m');
    } else {
      const m = clampM(parseInt(mDigits) || 0);
      setMDigits(pad(m));
      onChange(clampH(parseInt(hDigits) || 0), m);
      setActive(null);
    }
  }

  const displayValue = active === 'h' ? `Hora: ${hDigits}` : `Minutos: ${mDigits}`;

  return (
    <>
      <div className={styles.row}>
        <span className={styles.label}>Hora:</span>
        <div className={`${styles.field} ${active === 'h' ? styles.fieldActive : ''}`}
          role="textbox" tabIndex={0} onClick={openHour}
          onKeyDown={e => { if (e.key === 'Enter') openHour(); }}
          aria-label={`Hora: ${hDigits}`}>
          <span className={active === 'h' ? styles.cursor : styles.val}>{hDigits}</span>
        </div>
        <span className={styles.colon}>:</span>
        <div className={`${styles.field} ${active === 'm' ? styles.fieldActive : ''}`}
          role="textbox" tabIndex={0} onClick={openMinute}
          onKeyDown={e => { if (e.key === 'Enter') openMinute(); }}
          aria-label={`Minutos: ${mDigits}`}>
          <span className={active === 'm' ? styles.cursor : styles.val}>{mDigits}</span>
        </div>
      </div>
      <NumericKeyboard open={active !== null} displayValue={displayValue}
        onDigit={handleDigit} onBackspace={handleBackspace} onDone={handleDone} variant={variant} />
    </>
  );
}
