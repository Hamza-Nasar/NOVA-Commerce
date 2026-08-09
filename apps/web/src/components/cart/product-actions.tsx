'use client';
import { useState } from 'react';
import type { Product } from '@/types/catalog';
import { cartApi } from '@/lib/api/cart.api';
import { wishlistApi } from '@/lib/api/wishlist.api';
export function ProductActions({product,variantId}:{product:Product;variantId?:string}){const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const act=async(fn:()=>Promise<unknown>,ok:string)=>{setBusy(true);setMessage('');try{await fn();setMessage(ok)}catch(e:any){setMessage(e.message||'Request failed')}finally{setBusy(false)}};return <div className="space-y-2"><div className="flex gap-2"><button disabled={busy||((product.variants.length>0)&&!variantId)} onClick={()=>act(()=>cartApi.add({productId:product.id,variantId,quantity:1}),'Added to cart')} className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">{busy?'Adding…':'Add to cart'}</button><button disabled={busy} onClick={()=>act(()=>wishlistApi.add({productId:product.id,variantId}),'Added to wishlist')} className="rounded-md border px-4 py-2">Wishlist</button></div>{message?<p role="status" className="text-sm text-muted-foreground">{message}</p>:null}</div>}
