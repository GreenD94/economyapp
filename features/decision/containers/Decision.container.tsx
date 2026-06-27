'use client';
import { useState } from 'react';
import { useDecision } from '../hooks/useDecision.hook';
import { InfoModal } from '@/features/core/components/InfoModal.component';
import { INFO } from '@/features/core/content/info.content';
import styles from '../styles/Decision.module.css';

const FACES = [
  { value: 1, icon: 'sentiment_very_dissatisfied' },
  { value: 2, icon: 'sentiment_dissatisfied' },
  { value: 3, icon: 'sentiment_neutral' },
  { value: 4, icon: 'sentiment_satisfied' },
  { value: 5, icon: 'sentiment_very_satisfied' },
];

const FACE_SEL_CLS: Record<number, string> = {
  1: styles.faceSel1,
  2: styles.faceSel2,
  3: styles.faceSel3,
  4: styles.faceSel4,
  5: styles.faceSel5,
};

const DIMS = [
  { key: 'health',       label: 'Salud' },
  { key: 'productivity', label: 'Productividad' },
  { key: 'comfort',      label: 'Comodidad' },
] as const;

export function DecisionContainer() {
  const { inputs, result, update } = useDecision();
  const [infoOpen, setInfoOpen] = useState(false);
  const infoD = INFO.purchases.decision;

  const verdictClass = result.verdictColor === 'green' ? styles.verdictGreen
    : result.verdictColor === 'yellow' ? styles.verdictYellow
    : styles.verdictRed;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>Decisor</span>
        <button className={styles.infoBtn} onClick={() => setInfoOpen(true)} aria-label="Info">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.inlineRow}>
          <div className={styles.field}>
            <label className={styles.label}>Precio ($)</label>
            <input className={styles.input} type="number" step="0.01" min="0" placeholder="0.00"
              value={inputs.price || ''} onChange={e => update('price', parseFloat(e.target.value) || 0)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Días</label>
            <input className={styles.input} type="number" min="1" placeholder="1"
              value={inputs.days || ''} onChange={e => update('days', parseInt(e.target.value) || 1)} />
          </div>
        </div>

        {DIMS.map(({ key, label }) => (
          <div key={key} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <div className={styles.faceRow}>
              {FACES.map(({ value, icon }) => (
                <button
                  key={value}
                  className={`${styles.faceBtn} ${inputs[key] === value ? FACE_SEL_CLS[value] : ''}`}
                  onClick={() => update(key, value)}
                  aria-label={`${label} ${value}`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.verdict} ${verdictClass}`}>{result.verdict}</div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} title={infoD.title}
        howItWorks={<>{infoD.howItWorks.map((p, i) => <p key={i}>{p}</p>)}</>}
        glossary={infoD.glossary} />
    </div>
  );
}
