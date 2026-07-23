import { Store, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return <main className="mx-auto max-w-6xl px-6 py-20">
    <nav className="flex items-center justify-between"><span className="text-xl font-bold tracking-tight">NOVA</span><Button variant="outline">Sign in</Button></nav>
    <section className="py-24 text-center"><p className="mb-4 font-medium text-primary">Commerce, elevated</p><h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">A foundation ready for your next storefront.</h1><p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">NOVA Commerce pairs a polished customer experience with a scalable, modular platform.</p><div className="mt-9"><Button>Explore products</Button></div></section>
    <section className="grid gap-5 md:grid-cols-3">{[
      [Store, 'Extensible catalog', 'Domain modules grow without reshaping the application.'],
      [Truck, 'Reliable operations', 'Inventory, orders and notifications have clear boundaries.'],
      [ShieldCheck, 'Production baseline', 'Validated config, secure defaults and observable failures.'],
    ].map(([Icon, title, copy]) => { const FeatureIcon = Icon as typeof Store; return <article key={String(title)} className="rounded-xl border bg-[var(--muted)] p-6"><FeatureIcon className="mb-4 text-primary" /><h2 className="font-semibold">{String(title)}</h2><p className="mt-2 text-sm text-gray-500">{String(copy)}</p></article>; })}</section>
  </main>;
}
