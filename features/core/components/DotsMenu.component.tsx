'use client';
import { useState } from 'react';
import styles from './DotsMenu.module.css';

export type DotsMenuItem = {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
};

export function DotsMenu({ items, title }: { items: DotsMenuItem[]; title?: string }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  function dismiss() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 320);
  }

  const mounted = open || closing;

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Opciones"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {mounted && (
        <>
          <div
            className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`}
            onClick={dismiss}
          />
          <div className={`${styles.sheet} ${closing ? styles.sheetClosing : ''}`} role="menu">
            {title && <div className={styles.sheetTitle}>{title}</div>}
            {items.map((item, i) => (
              <button
                key={i}
                className={`${styles.item} ${item.danger ? styles.danger : ''}`}
                role="menuitem"
                onClick={() => { dismiss(); setTimeout(() => item.onClick(), 320); }}
              >
                {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
                {item.label}
              </button>
            ))}
            <button className={styles.cancelBtn} onClick={dismiss}>Cancelar</button>
          </div>
        </>
      )}
    </>
  );
}
