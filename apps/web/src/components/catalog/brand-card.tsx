import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/types/catalog';

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`} className="rounded-xl border bg-card p-4 transition hover:shadow-md">
      <div className="flex h-24 items-center justify-center rounded-lg bg-muted">
        {brand.logo ? <Image src={brand.logo} alt={brand.name} width={160} height={80} unoptimized className="max-h-20 object-contain" /> : <span className="text-lg font-semibold">{brand.name}</span>}
      </div>
      <p className="mt-3 font-medium">{brand.name}</p>
    </Link>
  );
}
