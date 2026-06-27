'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
    const isOnboarding = pathname.startsWith('/onboarding');
    if (!token && !isPublic && !isOnboarding) {
      router.replace('/login');
    }
  }, [token, isLoading, pathname, router]);

  if (isLoading) return null;
  return <>{children}</>;
}
