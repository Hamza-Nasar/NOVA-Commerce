'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from '@/components/forms/password-input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';

const profileSchema = z.object({ firstName: z.string().optional(), lastName: z.string().optional(), phone: z.string().optional(), profileImage: z.string().url().optional().or(z.literal('')) });
const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) });

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const changePassword = useUserStore((state) => state.changePassword);
  const profile = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), values: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '', profileImage: user?.profileImage ?? '' } });
  const password = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '' } });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-lg border p-5">
        <h1 className="text-2xl font-bold">Profile settings</h1>
        <form className="mt-5 space-y-4" onSubmit={profile.handleSubmit(async (values) => setUser(await updateProfile({ ...values, phone: values.phone || undefined, profileImage: values.profileImage || undefined })))}>
          <label className="block text-sm font-medium">First name<input autoComplete="given-name" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...profile.register('firstName')} /></label>
          <label className="block text-sm font-medium">Last name<input autoComplete="family-name" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...profile.register('lastName')} /></label>
          <label className="block text-sm font-medium">Phone<input autoComplete="tel" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...profile.register('phone')} /></label>
          <label className="block text-sm font-medium">Avatar URL<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...profile.register('profileImage')} /></label>
          {profile.formState.isSubmitSuccessful ? <p className="text-sm text-green-600">Profile updated.</p> : null}
          <Button>Save profile</Button>
        </form>
      </section>
      <section className="rounded-lg border p-5">
        <h2 className="text-2xl font-bold">Change password</h2>
        <form className="mt-5 space-y-4" onSubmit={password.handleSubmit(async (values) => { await changePassword(values); password.reset(); })}>
          <label className="block text-sm font-medium">Current password<PasswordInput autoComplete="current-password" {...password.register('currentPassword')} /></label>
          <label className="block text-sm font-medium">New password<PasswordInput autoComplete="new-password" {...password.register('newPassword')} /></label>
          {password.formState.isSubmitSuccessful ? <p className="text-sm text-green-600">Password changed. Please sign in again on other devices.</p> : null}
          <Button>Update password</Button>
        </form>
      </section>
    </div>
  );
}
