import { User } from '@/types/auth';
import { AvatarUpload } from './avatar-upload';

export function ProfileCard({ user }: { user: User }) {
  return (
    <section className="rounded-lg border p-5">
      <div className="flex items-center gap-4">
        <AvatarUpload />
        <div>
          <h2 className="text-lg font-semibold">{user.fullName ?? user.email}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{user.role}</p>
        </div>
      </div>
    </section>
  );
}
