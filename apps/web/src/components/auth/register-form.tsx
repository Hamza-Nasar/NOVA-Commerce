'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/forms/form-error';
import { PasswordInput } from '@/components/forms/password-input';
import { useAuthStore } from '@/stores/auth.store';

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\+[1-9]\d{7,14}$/.test(value), 'Use international format, e.g. +923001234567'),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Use uppercase, lowercase and number'),
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const form = useForm<RegisterValues>({ resolver: zodResolver(schema), defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '' } });

  const submit = form.handleSubmit(async (values) => {
    try {
      await registerUser({ ...values, phone: values.phone || undefined });
      router.push('/profile');
    } catch {
      // The auth store exposes the registration error in the form.
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormError message={error} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">First name<input autoComplete="given-name" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('firstName')} /></label>
        <label className="block text-sm font-medium">Last name<input autoComplete="family-name" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('lastName')} /></label>
      </div>
      <label className="block text-sm font-medium">Email<input autoComplete="email" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('email')} /></label>
      <label className="block text-sm font-medium">
        Phone <span className="text-muted-foreground">(optional)</span>
        <input placeholder="+923001234567" autoComplete="tel" className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('phone')} />
      </label>
      <label className="block text-sm font-medium">Password<PasswordInput autoComplete="new-password" className="mt-1" {...form.register('password')} /></label>
      <p className="text-sm text-red-600">{Object.values(form.formState.errors)[0]?.message}</p>
      <Button className="w-full" disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create account'}</Button>
    </form>
  );
}
