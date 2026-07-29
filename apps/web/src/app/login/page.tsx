import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-gray-500">Access your NOVA Commerce account.</p>
      <div className="mt-8"><LoginForm /></div>
    </main>
  );
}
