import Link from 'next/link';
import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SessionExpiredModal } from '@/components/auth/session-expired-modal';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SessionExpiredModal />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold">NOVA</Link>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/products">Products</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/profile/settings">Settings</Link>
            <Link href="/profile/addresses">Addresses</Link>
          </div>
        </nav>
        {children}
      </main>
    </ProtectedRoute>
  );
}
