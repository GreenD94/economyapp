'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './NoteInput.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onRemove?: () => void;
}

function previewNote(v: string) {
  const words = v.trim().split(/\s+/);
  return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
}

export function NoteInput({
  value,
  onChange,
  placeholder = 'Ej: me subieron el sueldo, cambié de trabajo...',
  onRemove,
}: Props) {
  const [open,    setOpen]    = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft,   setDraft]   = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleOpen() {
    setDraft(value);
    setOpen(true);
  }

  function handleDone() {
    onChange(draft);
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 320);
  }

  useEffect(() => {
    if (open && !closing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open, closing]);

  return (
    <>
      {value ? (
        <div className={styles.noteRow}>
          <span className={styles.notePreview} onClick={handleOpen}>
            {previewNote(value)}
          </span>
          <button className={styles.iconBtn} onClick={handleOpen} title="Editar razón">
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button className={styles.iconBtn} onClick={() => onRemove?.()} title="Eliminar razón">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      ) : (
        <button className={styles.trigger} onClick={handleOpen}>
          ¿Por qué haces este cambio?
        </button>
      )}

      {open && (
        <>
          <div className={styles.backdrop} onClick={handleDone} />
          <div className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}>
            <p className={styles.panelLabel}>¿Por qué haces este cambio?</p>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              value={draft}
              maxLength={500}
              placeholder={placeholder}
              onChange={e => setDraft(e.target.value)}
            />
            <button className={styles.doneBtn} onClick={handleDone}>
              Listo
            </button>
          </div>
        </>
      )}
    </>
  );
}
