import { Product } from '@/types/catalog';
import { EmptyState } from './states';
import { ProductCard } from './product-card';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <EmptyState title="No products found" description="Try a different category, brand, or filter." />;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
