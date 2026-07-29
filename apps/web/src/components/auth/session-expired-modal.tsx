'use client';

import Link from 'next/link';
import { useSessionStore } from '@/stores/session.store';

export function SessionExpiredModal() {
  const expired = useSessionStore((state) => state.expired);
  if (!expired) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Session expired</h2>
        <p className="mt-2 text-sm text-gray-500">Your session needs a fresh sign-in.</p>
        <Link href="/login" className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Sign in again</Link>
      </div>
    </div>
  );
}
