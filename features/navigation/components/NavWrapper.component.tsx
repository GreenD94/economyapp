'use client';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar.component';
import { BottomNav } from './BottomNav.component';

const NO_NAV_PREFIXES = ['/login', '/register', '/onboarding'];

export function NavWrapper() {
  const pathname = usePathname();
  if (NO_NAV_PREFIXES.some(p => pathname.startsWith(p))) return null;
  return (
    <>
      <TopBar />
      <BottomNav />
    </>
  );
}
