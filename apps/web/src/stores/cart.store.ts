import { create } from 'zustand';
type CartItem = { productId: string; quantity: number };
type CartState = { items: CartItem[]; add: (item: CartItem) => void; remove: (productId: string) => void };
export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) => set((state) => ({ items: [...state.items.filter((entry) => entry.productId !== item.productId), item] })),
  remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
}));
