'use client';
import styles from '../styles/Auth.module.css';

export function DomainPills({ domains, onSelect }: { domains: string[]; onSelect: (d: string) => void }) {
  return (
    <div className={styles.domainPills}>
      {domains.map(d => (
        <button key={d} type="button" className={styles.domainPill}
          onPointerDown={e => { e.preventDefault(); onSelect(d); }}>
          {d}
        </button>
      ))}
    </div>
  );
}

export function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={styles.eyeBtn} onClick={onToggle} tabIndex={-1} aria-label="Mostrar/ocultar contraseña">
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
        {show ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  );
}

export function RuleList({ rules }: { rules: { label: string; broken: boolean }[] }) {
  const broken = rules.filter(r => r.broken);
  if (broken.length === 0) return null;
  return (
    <ul className={styles.ruleList}>
      {broken.map(r => (
        <li key={r.label} className={styles.ruleItem}>
          <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
          {r.label}
        </li>
      ))}
    </ul>
  );
}
