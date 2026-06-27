'use client';
import { useState, useEffect } from 'react';
import { CATEGORIES, EXPENSE_TYPES } from '@/features/expenses/hooks/useExpenses.hook';
import styles from '../styles/Transactions.module.css';

interface Props {
  mode: 'category' | 'type';
  categoryFilters: string[];
  typeFilters: string[];
  onToggleCat: (c: string) => void;
  onToggleType: (t: string) => void;
  onClose: () => void;
}

export function ExpenseFilterKeyboard({ mode, categoryFilters, typeFilters, onToggleCat, onToggleType, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  }

  const visibleCats = search.trim()
    ? CATEGORIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : CATEGORIES;

  return (
    <>
      <div className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`} onClick={close} />
      <div className={`${styles.filterKeyboard} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.filterKeyboardBody} ${revealed ? styles.filterKeyboardRevealed : ''}`}>

          <div className={styles.filterPickerHeader}>
            <button className={styles.filterPickerBack} onClick={close}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className={styles.filterPickerTitle}>
              {mode === 'category' ? 'Categoría' : 'Clasificación'}
            </span>
          </div>

          {mode === 'category' && (
            <div className={styles.filterPickerSearch}>
              <span className="material-symbols-outlined">search</span>
              <input className={styles.filterPickerInput} placeholder="Buscar..."
                value={search} onChange={e => setSearch(e.target.value)} autoFocus />
              {search && (
                <button className={styles.filterPickerClear} onClick={() => setSearch('')}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          )}

          <div className={styles.filterPickerPills}>
            {mode === 'category'
              ? visibleCats.map(c => (
                  <button key={c}
                    className={`${styles.filterPickerPill} ${categoryFilters.includes(c) ? styles.filterPickerPillActive : ''}`}
                    onClick={() => onToggleCat(c)}>
                    {c}
                  </button>
                ))
              : EXPENSE_TYPES.map(t => (
                  <button key={t}
                    className={`${styles.filterPickerPill} ${typeFilters.includes(t) ? styles.filterPickerPillActive : ''}`}
                    onClick={() => onToggleType(t)}>
                    {t}
                  </button>
                ))
            }
          </div>

        </div>
      </div>
    </>
  );
}
