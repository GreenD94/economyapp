'use client';
import { useEffect, useState } from 'react';
import styles from './NumericKeyboard.module.css';

type Variant = 'spend' | 'earn';
const VARIANT_VARS: Record<Variant, React.CSSProperties> = {
  spend: { '--step-color': 'var(--c-spend)', '--step-mid': '#f48fb1', '--step-light': '#f8bbd9' } as React.CSSProperties,
  earn:  { '--step-color': 'var(--c-earn)',  '--step-mid': '#66bb6a', '--step-light': '#c8e6c9' } as React.CSSProperties,
};

type NumericKeyboardProps = {
  open: boolean;
  displayValue: string;
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onDone: () => void;
  variant?: Variant;
};

const ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

const CLOSE_DELAY = 320; // slightly longer than the slide-down animation

export function NumericKeyboard({ open, displayValue, onDigit, onBackspace, onDone, variant }: NumericKeyboardProps) {
  const [mounted, setMounted]  = useState(open);
  const [closing, setClosing]  = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      // Start closing animation, keep backdrop alive to absorb ghost clicks
      setClosing(true);
      const t = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, CLOSE_DELAY);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop stays mounted during close — absorbs ghost clicks */}
      <div
        className={styles.backdrop}
        style={{ background: closing ? 'transparent' : undefined }}
        onPointerDown={e => { e.preventDefault(); if (!closing) onDone(); }}
      />
      <div className={`${styles.keyboard} ${closing ? styles.keyboardClosing : ''}`} style={variant ? VARIANT_VARS[variant] : undefined}>
        <div className={styles.valueDisplay}>{displayValue}</div>
        {ROWS.map(row => (
          <div key={row[0]} className={styles.row}>
            {row.map(d => (
              <button
                key={d}
                type="button"
                className={styles.digitBtn}
                onPointerDown={e => { e.preventDefault(); onDigit(d); }}
              >
                {d}
              </button>
            ))}
          </div>
        ))}
        <div className={styles.row}>
          <button
            type="button"
            className={styles.actionBtn}
            onPointerDown={e => { e.preventDefault(); onBackspace(); }}
          >
            <span className="material-symbols-outlined">backspace</span>
          </button>
          <button
            type="button"
            className={styles.digitBtn}
            onPointerDown={e => { e.preventDefault(); onDigit('0'); }}
          >
            0
          </button>
          <button
            type="button"
            className={styles.doneBtn}
            onPointerDown={e => { e.preventDefault(); onDone(); }}
          >
            Listo
          </button>
        </div>
      </div>
    </>
  );
}
