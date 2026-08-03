import Link from 'next/link';
import { Category } from '@/types/catalog';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="rounded-xl border bg-card p-4 transition hover:shadow-md">
      <div className="aspect-video overflow-hidden rounded-lg bg-muted">
        {category.image ? <img src={category.image} alt={category.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Category</div>}
      </div>
      <h3 className="mt-3 font-semibold">{category.name}</h3>
      {category.description ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p> : null}
    </Link>
  );
}
