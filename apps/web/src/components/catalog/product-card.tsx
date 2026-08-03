import Link from 'next/link';
import { Product } from '@/types/catalog';
import { ProductBadge } from './product-badge';
import { ProductPrice } from './product-price';

export function ProductCard({ product }: { product: Product }) {
  const image = product.images.find((item) => item.isPrimary) ?? product.images[0];
  return (
    <Link href={`/products/${product.slug}`} className="group rounded-xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        {image ? <img src={image.imageUrl} alt={image.altText ?? product.name} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>}
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 font-medium">{product.name}</p>
          <ProductBadge product={product} />
        </div>
        {product.brand ? <p className="text-sm text-muted-foreground">{product.brand.name}</p> : null}
        <ProductPrice product={product} />
      </div>
    </Link>
  );
}
