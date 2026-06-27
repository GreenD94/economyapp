'use client';
import { useState } from 'react';
import styles from './DayInput.module.css';
import { NumericKeyboard } from './NumericKeyboard.component';

type DayInputProps = {
  value: number;
  onChange: (day: number) => void;
};

function clamp(n: number) { return Math.min(31, Math.max(1, n)); }

export function DayInput({ value, onChange }: DayInputProps) {
  const [digits, setDigits] = useState(String(value));
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() { setIsOpen(true); }

  function handleDone() {
    setIsOpen(false);
    const n = clamp(parseInt(digits) || 1);
    setDigits(String(n));
    onChange(n);
  }

  function handleDigit(d: string) {
    setDigits(prev => {
      const next = prev === '0' ? d : prev + d;
      const n = parseInt(next);
      if (n > 31) return d;
      return next;
    });
  }

  function handleBackspace() {
    setDigits(prev => prev.length > 1 ? prev.slice(0, -1) : '1');
  }

  return (
    <>
      <div
        className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ''}`}
        onClick={handleOpen}
        role="textbox"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
        aria-label={`Día del mes: ${digits}`}
      >
        <span className={styles.prefix}>Día</span>
        <span className={isOpen ? styles.cursorChar : styles.value}>{digits}</span>
      </div>
      <NumericKeyboard
        open={isOpen}
        displayValue={`Día ${digits}`}
        onDigit={handleDigit}
        onBackspace={handleBackspace}
        onDone={handleDone}
      />
    </>
  );
}
