'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from '@/components/forms/password-input';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth.api';

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
});

export function ResetPasswordForm() {
  const params = useSearchParams();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { token: params.get('token') ?? '', password: '' } });
  return (
    <form onSubmit={form.handleSubmit((values) => authApi.resetPassword(values.token, values.password))} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">Reset token<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('token')} /></label>
      <label className="block text-sm font-medium">New password<PasswordInput autoComplete="new-password" {...form.register('password')} /></label>
      {form.formState.isSubmitSuccessful ? <p className="text-sm text-green-600">Reset request accepted.</p> : null}
      <Button className="w-full">Reset password</Button>
      <Link href="/login" className="block text-sm text-gray-500">Back to login</Link>
    </form>
  );
}
