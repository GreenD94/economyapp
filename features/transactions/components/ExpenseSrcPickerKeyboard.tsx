'use client';
import { useState, useEffect } from 'react';
import styles from '../styles/Transactions.module.css';

interface Props {
  mode: 'category' | 'classification';
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onAddNew: (v: string) => void;
  onClose: () => void;
}

export function ExpenseSrcPickerKeyboard({ mode, options, selected, onSelect, onAddNew, onClose }: Props) {
  const [closing, setClosing]     = useState(false);
  const [revealed, setRevealed]   = useState(false);
  const [search, setSearch]       = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newValue, setNewValue]   = useState('');

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 260);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  }

  function handleSelect(v: string) { onSelect(v); close(); }

  const alreadyExists = options.some(o => o.toLowerCase() === newValue.trim().toLowerCase());
  const canAdd = newValue.trim().length > 0 && !alreadyExists;

  function handleAdd() {
    if (!canAdd) return;
    onAddNew(newValue.trim());
    onSelect(newValue.trim());
    close();
  }

  const title          = mode === 'category' ? 'Categoría' : 'Clasificación';
  const newPlaceholder = mode === 'category' ? 'Nueva categoría...' : 'Nueva clasificación...';

  const visible = search.trim()
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <>
      <div className={`${styles.detailBackdrop} ${closing ? styles.detailBackdropClosing : ''}`} onClick={close} />
      <div className={`${styles.filterKeyboard} ${closing ? styles.detailSheetClosing : ''}`}>
        <div className={`${styles.filterKeyboardBody} ${revealed ? styles.filterKeyboardRevealed : ''}`}>

          <div className={`${styles.filterPickerHeader} ${styles.filterPickerHeaderSpaced}`}>
            <button className={styles.filterPickerBack} onClick={close}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className={styles.filterPickerTitle}>{title}</span>
            <button className={styles.pickerHeaderAdd}
              onClick={() => { setAddingNew(a => !a); setNewValue(''); }}>
              <span className="material-symbols-outlined">{addingNew ? 'close' : 'add'}</span>
            </button>
          </div>

          {addingNew && (
            <div className={styles.pickerAddRow}>
              <input autoFocus className={styles.pickerAddInput} maxLength={100}
                placeholder={newPlaceholder} value={newValue}
                onChange={e => setNewValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} />
              <button className={styles.pickerAddConfirm} onClick={handleAdd} disabled={!canAdd}>
                Agregar
              </button>
            </div>
          )}

          {mode === 'category' && (
            <div className={styles.filterPickerSearch}>
              <span className="material-symbols-outlined">search</span>
              <input className={styles.filterPickerInput} placeholder="Buscar..."
                value={search} onChange={e => setSearch(e.target.value)} autoFocus={!addingNew} />
              {search && (
                <button className={styles.filterPickerClear} onClick={() => setSearch('')}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          )}

          <div className={styles.filterPickerPills}>
            {visible.map(o => (
              <button key={o}
                className={`${styles.filterPickerPill} ${selected === o ? styles.filterPickerPillActive : ''}`}
                onClick={() => handleSelect(o)}>
                {o}
              </button>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
