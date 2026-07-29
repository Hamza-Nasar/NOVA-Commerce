import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Create account</h1>
      <p className="mt-2 text-gray-500">Start with a secure customer profile.</p>
      <div className="mt-8"><RegisterForm /></div>
    </main>
  );
}
