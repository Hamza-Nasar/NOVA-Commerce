import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/catalog';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="rounded-xl border bg-card p-4 transition hover:shadow-md">
      <div className="aspect-video overflow-hidden rounded-lg bg-muted">
        {category.image ? <Image src={category.image} alt={category.name} width={640} height={360} unoptimized className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Category</div>}
      </div>
      <h3 className="mt-3 font-semibold">{category.name}</h3>
      {category.description ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p> : null}
    </Link>
  );
}
