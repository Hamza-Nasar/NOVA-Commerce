import { brandsApi } from '@/lib/api/brands.api';
import { BrandCard } from '@/components/catalog/brand-card';
import { EmptyState } from '@/components/catalog/states';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await brandsApi.list({ limit: 50 });
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Brands</h1>
      <p className="mt-2 text-muted-foreground">Browse products by brand.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {brands.items.map((brand) => <BrandCard key={brand.id} brand={brand} />)}
      </div>
      {!brands.items.length ? <EmptyState title="No brands yet" /> : null}
    </main>
  );
}
