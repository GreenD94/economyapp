'use client';
import { useState, useEffect } from 'react';
import styles from './Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'spend' | 'earn' | 'save';
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, variant, children }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!open) { setRevealed(false); return; }
    const t = setTimeout(() => setRevealed(true), 210);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const variantStyle = variant ? { '--step-color': `var(--c-${variant})` } as React.CSSProperties : undefined;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} style={variantStyle} onClick={e => e.stopPropagation()}>
        {title !== undefined && (
          <div className={`${styles.header} ${revealed ? styles.revealed : ''}`}>
            <span className={styles.title}>{title}</span>
          </div>
        )}
        <div className={`${styles.body} ${revealed ? styles.revealed : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
