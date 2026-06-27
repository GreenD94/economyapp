'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../styles/TopBar.module.css';

const TITLES: Record<string, string> = {
  '/':             'Economy Tracker',
  '/transactions': 'Movimientos',
  '/finance':      'Finanzas',
  '/purchases':    'Compras',
  '/settings':     'Ajustes',
  '/profile':      'Mi Perfil',
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = TITLES[pathname] ?? 'Economy Tracker';

  return (
    <header className={styles.bar}>
      <button className={styles.homeBtn} onClick={() => router.push('/')} aria-label="Inicio">
        <span className="material-symbols-outlined">savings</span>
      </button>
      <span className={styles.title}>{title}</span>
      <button className={styles.profileBtn} onClick={() => router.push('/profile')} aria-label="Perfil">
        <span className="material-symbols-outlined">account_circle</span>
      </button>
    </header>
  );
}
