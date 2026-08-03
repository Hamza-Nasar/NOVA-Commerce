import { brandsApi } from '@/lib/api/brands.api';
import { ProductGrid } from '@/components/catalog/product-grid';
import { Pagination } from '@/components/catalog/pagination';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<Record<string, string | undefined>> };

export default async function BrandDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const page = Number(query.page ?? 1);
  const [brand, products] = await Promise.all([brandsApi.bySlug(slug), brandsApi.products(slug, { page, limit: 12, sort: query.sort as never })]);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center gap-4">
        {brand.logo ? <Image src={brand.logo} alt={brand.name} width={64} height={64} unoptimized className="h-16 w-16 rounded-lg object-contain" /> : null}
        <div>
          <h1 className="text-3xl font-bold">{brand.name}</h1>
          {brand.description ? <p className="mt-2 max-w-2xl text-muted-foreground">{brand.description}</p> : null}
        </div>
      </div>
      <div className="mt-8"><ProductGrid products={products.items} /></div>
      <Pagination page={products.page} totalPages={products.totalPages} basePath={`/brands/${slug}`} />
    </main>
  );
}
import Image from 'next/image';
