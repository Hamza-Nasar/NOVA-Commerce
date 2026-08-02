import { categoriesApi } from '@/lib/api/categories.api';
import { CategoryCard } from '@/components/catalog/category-card';
import { EmptyState } from '@/components/catalog/states';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await categoriesApi.list({ limit: 50 });
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="mt-2 text-muted-foreground">Browse product departments and collections.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.items.map((category) => <CategoryCard key={category.id} category={category} />)}
      </div>
      {!categories.items.length ? <EmptyState title="No categories yet" /> : null}
    </main>
  );
}
