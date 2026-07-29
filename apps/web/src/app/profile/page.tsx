'use client';

import { useAuthStore } from '@/stores/auth.store';
import { ProfileCard } from '@/components/profile/profile-card';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-gray-500">Your identity layer for future orders, checkout, wishlist and dashboard access.</p>
      </div>
      <ProfileCard user={user} />
    </div>
  );
}
