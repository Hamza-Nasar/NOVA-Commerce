import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
export function Header() { return <header className="border-b"><nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"><Link className="font-bold tracking-tight" href="/">NOVA</Link><div className="flex items-center gap-6 text-sm"><Link href="/products">Shop</Link><Link className="relative" href="/cart" aria-label="Cart"><ShoppingBag className="size-5" /></Link></div></nav></header>; }
