'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, Tag, AlertCircle, Settings } from 'lucide-react';

const navigationItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: Receipt, label: 'Transactions' },
  { href: '/budgets', icon: Tag, label: 'Budgets' },
  { href: '/categories', icon: Tag, label: 'Categories' },
  { href: '/limits', icon: AlertCircle, label: 'Limits' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg safe-area-inset-bottom">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-2 pb-safe">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 transition-colors touch-manipulation ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 active:text-gray-700'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
