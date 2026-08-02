import { Product, ProductVariant } from '@/types/catalog';

type Props = { product?: Product; variant?: ProductVariant };

export function ProductPrice({ product, variant }: Props) {
  const amount = Number(variant?.price ?? product?.basePrice ?? 0);
  const compare = variant?.compareAtPrice ?? product?.compareAtPrice;
  const currency = product?.currency ?? 'USD';
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)}</span>
      {compare ? <span className="text-sm text-muted-foreground line-through">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(compare))}</span> : null}
    </div>
  );
}
