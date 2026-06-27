'use client';
import { useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import { fmt, type PieSlice } from '../dashboard.helpers';

export function SpendingPie({ slices }: { slices: PieSlice[] }) {
  const [selected, setSelected] = useState<PieSlice | null>(null);
  if (slices.length === 0) {
    return <p style={{ color: 'var(--c-text-muted)', fontSize: '13px', textAlign: 'center' }}>Sin gastos este mes</p>;
  }

  const R = 80, r = 45, cx = 100, cy = 100;
  let cumPct = 0;
  const paths = slices.map((s) => {
    const start = cumPct * 2 * Math.PI - Math.PI / 2;
    cumPct += s.pct;
    const end   = cumPct * 2 * Math.PI - Math.PI / 2;
    const large = s.pct > 0.5 ? 1 : 0;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end),   y2 = cy + R * Math.sin(end);
    const x3 = cx + r * Math.cos(end),   y3 = cy + r * Math.sin(end);
    const x4 = cx + r * Math.cos(start), y4 = cy + r * Math.sin(start);
    const d   = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${large},0 ${x4},${y4} Z`;
    return { ...s, d };
  });

  return (
    <div className={styles.pieWrap}>
      <div className={styles.pieContainer}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {paths.map((p) => (
            <path key={p.cat} d={p.d} fill={p.color}
              opacity={selected && selected.cat !== p.cat ? 0.45 : 1}
              onClick={() => setSelected(selected?.cat === p.cat ? null : p)}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            />
          ))}
        </svg>
        <div className={styles.pieCenter}>
          {selected ? (
            <>
              <span className={styles.pieCenterCat}>{selected.cat}</span>
              <span className={styles.pieCenterAmt}>{fmt(selected.amount)}</span>
            </>
          ) : (
            <span className={styles.pieCenterCat}>Toca una porción</span>
          )}
        </div>
      </div>
      <div className={styles.legend}>
        {slices.map((s) => (
          <div key={s.cat} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: s.color }} />
            <span className={styles.legendName}>{s.cat}</span>
            <span className={styles.legendAmt}>{fmt(s.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
