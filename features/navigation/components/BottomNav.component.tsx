'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/BottomNav.module.css';

const TABS = [
  { label: 'Movimientos', href: '/transactions', icon: 'swap_vert'    },
  { label: 'Finanzas',    href: '/finance',      icon: 'bar_chart'    },
  { label: 'Compras',     href: '/purchases',    icon: 'shopping_bag' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`${styles.tab} ${pathname.startsWith(tab.href) ? styles.active : ''}`}
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
