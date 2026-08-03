import { Product } from '@/types/catalog';

export function ProductImageGallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : [{ id: 'placeholder', imageUrl: '', altText: product.name, productId: product.id, sortOrder: 0, isPrimary: true }];
  const primary = images.find((image) => image.isPrimary) ?? images[0];
  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-2xl border bg-muted">
        {primary.imageUrl ? <Image src={primary.imageUrl} alt={primary.altText ?? product.name} width={800} height={800} unoptimized className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground">No product image</div>}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.filter((image) => image.imageUrl).map((image) => (
          <div key={image.id} className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image src={image.imageUrl} alt={image.altText ?? product.name} width={160} height={160} unoptimized className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
import Image from 'next/image';
