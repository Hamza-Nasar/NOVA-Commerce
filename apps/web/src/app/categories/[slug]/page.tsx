import { categoriesApi } from '@/lib/api/categories.api';
import { ProductGrid } from '@/components/catalog/product-grid';
import { Pagination } from '@/components/catalog/pagination';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<Record<string, string | undefined>> };

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const page = Number(query.page ?? 1);
  const [category, products] = await Promise.all([categoriesApi.bySlug(slug), categoriesApi.products(slug, { page, limit: 12, sort: query.sort as never })]);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      {category.description ? <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p> : null}
      <div className="mt-8"><ProductGrid products={products.items} /></div>
      <Pagination page={products.page} totalPages={products.totalPages} basePath={`/categories/${slug}`} />
    </main>
  );
}
