'use client';
import { useEffect, useState } from 'react';
import { wishlistApi } from '@/lib/api/wishlist.api';
export default function WishlistPage(){const [items,setItems]=useState<any[]>([]);const [error,setError]=useState(''); useEffect(()=>{wishlistApi.get().then((w:any)=>setItems(w.items||[])).catch(e=>setError(e.message));},[]); return <main className="mx-auto max-w-4xl p-8"><h1 className="text-3xl font-bold">Wishlist</h1>{error?<p className="mt-4 text-red-400">{error}</p>:!items.length?<p className="mt-8 text-slate-400">Your wishlist is empty.</p>:<div className="mt-8 grid gap-4 sm:grid-cols-2">{items.map(i=><div className="rounded border p-4" key={i.id}>{i.product.name}</div>)}</div>}</main>}
