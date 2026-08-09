'use client';

import { useEffect } from 'react';
import { Product } from '@/types/catalog';
import { useCatalogStore } from '@/stores/catalog.store';
import { ProductPrice } from './product-price';
import { ProductActions } from '@/components/cart/product-actions';

export function ProductVariantSelector({ product }: { product: Product }) {
  const { selectedVariantId, selectedOptions, setSelectedVariant, setSelectedOption, resetSelection } = useCatalogStore();
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants.find((variant) => variant.isDefault) ?? product.variants[0];

  useEffect(() => {
    resetSelection();
    if (selectedVariant) setSelectedVariant(selectedVariant.id);
  }, [product.id, resetSelection, selectedVariant, setSelectedVariant]);

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <ProductPrice product={product} variant={selectedVariant} />
      {product.options.map((option) => (
        <div key={option.id} className="space-y-2">
          <p className="text-sm font-medium">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <button
                type="button"
                key={value.id}
                onClick={() => setSelectedOption(option.id, value.id)}
                className={`rounded-md border px-3 py-2 text-sm ${selectedOptions[option.id] === value.id ? 'border-primary bg-primary text-primary-foreground' : 'bg-background'}`}
              >
                {value.value}
              </button>
            ))}
          </div>
        </div>
      ))}
      {product.variants.length ? (
        <label className="block text-sm font-medium">
          Variant
          <select value={selectedVariant?.id ?? ''} onChange={(event) => setSelectedVariant(event.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2">
            {product.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.name}{variant.sku ? ` · ${variant.sku}` : ''}</option>)}
          </select>
        </label>
      ) : null}
      {selectedVariant?.sku ? <p className="text-sm text-muted-foreground">SKU: {selectedVariant.sku}</p> : null}
      <ProductActions product={product} variantId={selectedVariant?.id} />
    </div>
  );
}
