'use client';
import { useState } from 'react';
import { Modal } from './Modal.component';
import styles from './InfoModal.module.css';

export type GlossaryTerm = { term: string; definition: string };

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  howItWorks: React.ReactNode;
  glossary: GlossaryTerm[];
};

export function InfoModal({ open, onClose, title, howItWorks, glossary }: Props) {
  const [tab, setTab] = useState<'how' | 'glossary'>('how');
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'es'));

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'how' ? styles.active : ''}`}
          onClick={() => setTab('how')}
        >
          Cómo funciona
        </button>
        <button
          className={`${styles.tab} ${tab === 'glossary' ? styles.active : ''}`}
          onClick={() => setTab('glossary')}
        >
          Glosario
        </button>
      </div>
      {tab === 'how' && <div className={styles.content}>{howItWorks}</div>}
      {tab === 'glossary' && (
        <div className={styles.glossary}>
          {sorted.map(({ term, definition }, i) => (
            <div key={term} className={styles.term}>
              <span className={styles.termLabel}>{term}</span>
              <span className={styles.termDef}>{definition}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
