'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product } from '@/types/catalog';
import { ProductGrid } from '@/components/catalog/product-grid';

const KEY = 'nova-recently-viewed';

export function RecentlyViewed({ product }: { product?: Product }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Product[];
    const next = product ? [product, ...current.filter((item) => item.id !== product.id)].slice(0, 8) : current;
    localStorage.setItem(KEY, JSON.stringify(next));
    queueMicrotask(() => setItems(next.filter((item) => !product || item.id !== product.id)));
  }, [product]);
  if (!items.length) return null;
  return <section className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-semibold">Recently viewed</h2><Link href="/products" className="text-sm text-primary">Browse all</Link></div><ProductGrid products={items} /></section>;
}
