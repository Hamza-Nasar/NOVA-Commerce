'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { UnauthorizedScreen } from './unauthorized-screen';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <UnauthorizedScreen />;
  return <>{children}</>;
}
