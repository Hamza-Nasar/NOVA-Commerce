'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth.api';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const sent = form.formState.isSubmitSuccessful;
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Forgot password</h1>
      <p className="mt-2 text-gray-500">Password reset delivery is prepared for the notifications module.</p>
      <form onSubmit={form.handleSubmit((values) => authApi.forgotPassword(values.email))} className="mt-8 space-y-4">
        <label className="block text-sm font-medium">Email<input className="mt-1 w-full rounded-md border bg-background px-3 py-2" {...form.register('email')} /></label>
        {sent ? <p className="text-sm text-green-600">If the email exists, reset instructions will be sent.</p> : null}
        <Button className="w-full">Request reset</Button>
      </form>
      <Link href="/login" className="mt-5 text-sm text-gray-500">Back to login</Link>
    </main>
  );
}
