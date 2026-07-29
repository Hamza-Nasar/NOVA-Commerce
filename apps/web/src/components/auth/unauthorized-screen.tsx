import Link from 'next/link';

export function UnauthorizedScreen() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">Authentication required</h1>
      <p className="mt-3 text-gray-500">Please sign in to continue to this area.</p>
      <Link href="/login" className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Sign in</Link>
    </main>
  );
}
