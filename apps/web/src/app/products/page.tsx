import Link from 'next/link';
import { productsApi } from '@/lib/api/products.api';
import { categoriesApi } from '@/lib/api/categories.api';
import { brandsApi } from '@/lib/api/brands.api';
import { ProductGrid } from '@/components/catalog/product-grid';
import { Pagination } from '@/components/catalog/pagination';

export const dynamic = 'force-dynamic';

type PageProps = { searchParams?: Promise<Record<string, string | undefined>> };

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? 1);
  const [products, categories, brands] = await Promise.all([
    productsApi.list({ page, limit: 12, q: params.q, category: params.category, brand: params.brand, featured: params.featured === 'true' ? true : undefined, sort: params.sort as never }),
    categoriesApi.list({ limit: 20 }),
    brandsApi.list({ limit: 20 }),
  ]);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Catalog</p>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Browse active published products. Cart and checkout are planned for future milestones.</p>
        </div>
        <form className="flex flex-wrap gap-2">
          <input name="q" defaultValue={params.q} placeholder="Search products" className="rounded-md border bg-background px-3 py-2 text-sm" />
          <select name="category" defaultValue={params.category ?? ''} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="">All categories</option>
            {categories.items.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select name="brand" defaultValue={params.brand ?? ''} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="">All brands</option>
            {brands.items.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
          <select name="sort" defaultValue={params.sort ?? 'newest'} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="name_asc">Name A-Z</option>
          </select>
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Apply</button>
        </form>
      </div>
      <div className="mb-6 flex gap-3 text-sm">
        <Link href="/categories" className="text-primary hover:underline">Browse categories</Link>
        <Link href="/products?featured=true" className="text-primary hover:underline">Featured</Link>
      </div>
      <ProductGrid products={products.items} />
      <Pagination page={products.page} totalPages={products.totalPages} basePath="/products" />
    </main>
  );
}
