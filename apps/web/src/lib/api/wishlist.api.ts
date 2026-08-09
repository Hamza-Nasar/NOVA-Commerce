import { catalogFetch } from './catalog-client';
export const wishlistApi = { get:()=>catalogFetch('/wishlist'), add:(body:any)=>catalogFetch('/wishlist/items',{method:'POST',body:JSON.stringify(body)}), remove:(id:string)=>catalogFetch(`/wishlist/items/${id}`,{method:'DELETE'}) };
