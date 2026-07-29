import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Reset password</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-gray-500">Loading reset form...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
