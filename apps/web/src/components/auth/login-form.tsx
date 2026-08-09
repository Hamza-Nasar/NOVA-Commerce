'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/forms/form-error';
import { PasswordInput } from '@/components/forms/password-input';
import { useAuthStore } from '@/stores/auth.store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const form = useForm<LoginValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      router.push('/profile');
    } catch {
      // The auth store exposes the server error in the form.
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormError message={error} />
      <label className="block text-sm font-medium">Email<input autoComplete="email" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('email')} /></label>
      <p className="text-sm text-red-600">{form.formState.errors.email?.message}</p>
      <label className="block text-sm font-medium">Password<PasswordInput autoComplete="current-password" className="mt-1" {...form.register('password')} /></label>
      <Button className="w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</Button>
      <div className="flex justify-between text-sm text-gray-500"><Link href="/forgot-password">Forgot password?</Link><Link href="/register">Create account</Link></div>
    </form>
  );
}
