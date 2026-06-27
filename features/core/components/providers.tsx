'use client';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
