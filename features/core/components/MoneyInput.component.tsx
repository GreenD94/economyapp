'use client';
import { useRef, useState, useEffect } from 'react';
import styles from './MoneyInput.module.css';
import { NumericKeyboard } from './NumericKeyboard.component';

type MoneyInputProps = {
  value: number;
  onChange: (value: number) => void;
  currencySymbol?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  variant?: 'spend' | 'earn';
};

function fmtEuro(n: number): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function digitsToNum(d: string): number {
  if (!d || d === '0') return 0;
  const p = d.padStart(3, '0');
  return parseFloat(`${p.slice(0, -2)}.${p.slice(-2)}`);
}

function numToDigits(n: number): string {
  return n === 0 ? '0' : String(Math.round(n * 100));
}

export function MoneyInput({
  value, onChange, currencySymbol = '$', disabled, autoFocus, compact, fullWidth, variant,
}: MoneyInputProps) {
  const [digits, setDigits] = useState(() => numToDigits(value));
  const [isOpen, setIsOpen] = useState(false);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const display = fmtEuro(digitsToNum(digits));
  const chars = display.split('');

  useEffect(() => { setDigits(numToDigits(value)); }, [value]);
  useEffect(() => { if (mirrorRef.current) setWidth(mirrorRef.current.offsetWidth); }, [digits, currencySymbol]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (autoFocus && !disabled) setIsOpen(true); }, []);

  function handleOpen()      { if (!disabled) setIsOpen(true); }
  function handleDone()      { setIsOpen(false); onChange(digitsToNum(digits)); }
  function handleDigit(d: string) { setDigits(prev => prev === '0' ? d : prev + d); }
  function handleBackspace() { setDigits(prev => prev.length > 1 ? prev.slice(0, -1) : '0'); }

  const wrapCls = [
    styles.wrapper,
    compact && styles.wrapperCompact,
    fullWidth && styles.wrapperFullWidth,
    isOpen && styles.wrapperFocused,
    disabled && styles.wrapperDisabled,
  ].filter(Boolean).join(' ');

  const mirrorCls  = [styles.mirror,  compact && styles.mirrorCompact].filter(Boolean).join(' ');
  const symbolCls  = [styles.symbol,  compact && styles.symbolCompact].filter(Boolean).join(' ');
  const displayCls = [styles.display, compact && styles.displayCompact].filter(Boolean).join(' ');

  return (
    <>
      <div className={wrapCls} onClick={handleOpen} role="textbox" tabIndex={disabled ? -1 : 0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
        aria-label={`${currencySymbol} ${display}`}
        style={fullWidth ? undefined : width ? { width: `${width}px` } : undefined}>
        <span ref={mirrorRef} className={mirrorCls} aria-hidden>{currencySymbol}&thinsp;{display}</span>
        <span className={symbolCls} aria-hidden>{currencySymbol}</span>
        <span className={displayCls}>
          {chars.map((ch, i) => (
            <span key={i} className={isOpen && i === chars.length - 1 ? styles.cursorChar : undefined}>{ch}</span>
          ))}
        </span>
      </div>
      <NumericKeyboard open={isOpen} displayValue={`${currencySymbol} ${display}`}
        onDigit={handleDigit} onBackspace={handleBackspace} onDone={handleDone} variant={variant} />
    </>
  );
}
