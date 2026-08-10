import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCart(userId?: string, guestSessionId?: string) {
    if (!userId && !guestSessionId) throw new BadRequestException('Guest session is required');
    const where = userId ? { userId, status: 'ACTIVE' as const } : { guestSessionId, status: 'ACTIVE' as const };
    let cart = await this.prisma.cart.findFirst({ where, include: { items: { include: { product: true, variant: true } }, coupon: { include: { promotion: true } } } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId, guestSessionId, currency: 'USD' }, include: { items: { include: { product: true, variant: true } }, coupon: { include: { promotion: true } } } });
    }
    return cart;
  }

  private async view(cart: any) {
    const items = cart.items.map((i: any) => ({ ...i, unitPrice: Number(i.variant?.price ?? i.product.basePrice), lineTotal: Number(i.variant?.price ?? i.product.basePrice) * i.quantity }));
    const subtotal = items.reduce((s: number, i: any) => s + i.lineTotal, 0);
    let discount = 0;
    const p = cart.coupon?.promotion;
    if (p && (!p.endsAt || p.endsAt > new Date()) && subtotal >= Number(p.minimumOrderAmount ?? 0)) discount = p.type === 'PERCENTAGE' ? subtotal * Number(p.value) / 100 : Number(p.value);
    if (p?.maximumDiscount) discount = Math.min(discount, Number(p.maximumDiscount));
    return { ...cart, items, subtotal, discount, estimatedTotal: Math.max(0, subtotal - discount), totalItems: items.reduce((s: number, i: any) => s + i.quantity, 0) };
  }

  async get(userId?: string, guest?: string) { return this.view(await this.getCart(userId, guest)); }
  async add(userId: string | undefined, guest: string | undefined, body: any) {
    if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 99) throw new BadRequestException('Invalid quantity');
    const product = await this.prisma.product.findFirst({ where: { id: body.productId, status: 'ACTIVE', publishedAt: { not: null } }, include: { variants: true } });
    if (!product) throw new NotFoundException('Product not found or inactive');
    const variant = body.variantId ? product.variants.find(v => v.id === body.variantId && v.status === 'ACTIVE') : null;
    if (body.variantId && !variant) throw new NotFoundException('Variant not found or inactive');
    const cart = await this.getCart(userId, guest);
    const existing = cart.items.find((i: { productId: any; variantId: any; }) => i.productId === body.productId && i.variantId === (body.variantId ?? null));
    if (existing) await this.prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + body.quantity, unitPriceSnapshot: variant?.price ?? product.basePrice } });
    else await this.prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, variantId: variant?.id, quantity: body.quantity, unitPriceSnapshot: variant?.price ?? product.basePrice } });
    return this.get(userId, guest);
  }
  async update(userId: string | undefined, guest: string | undefined, id: string, quantity: number) { if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new BadRequestException('Invalid quantity'); const cart = await this.getCart(userId, guest); const item = cart.items.find((i: { id: string; }) => i.id === id); if (!item) throw new NotFoundException('Cart item not found'); await this.prisma.cartItem.update({ where: { id }, data: { quantity } }); return this.get(userId, guest); }
  async remove(userId: string | undefined, guest: string | undefined, id: string) { const cart = await this.getCart(userId, guest); if (!cart.items.some((i: { id: string; }) => i.id === id)) throw new NotFoundException('Cart item not found'); await this.prisma.cartItem.delete({ where: { id } }); return this.get(userId, guest); }
  async clear(userId?: string, guest?: string) { const cart = await this.getCart(userId, guest); await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } }); return this.get(userId, guest); }
  async applyCoupon(userId: string | undefined, guest: string | undefined, code: string) { const coupon = await this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() }, include: { promotion: true } }); if (!coupon || coupon.status !== 'ACTIVE' || coupon.promotion.status !== 'ACTIVE' || coupon.startsAt > new Date() || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)) throw new BadRequestException('Invalid or expired coupon'); const cart = await this.getCart(userId, guest); const subtotal = cart.items.reduce((s: number,i: { variant: { price: any; }; product: { basePrice: any; }; quantity: number; }) => s + Number(i.variant?.price ?? i.product.basePrice) * i.quantity, 0); if (coupon.promotion.minimumOrderAmount && subtotal < Number(coupon.promotion.minimumOrderAmount)) throw new BadRequestException('Minimum order amount not met'); await this.prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } }); return this.get(userId, guest); }
  async removeCoupon(userId?: string, guest?: string) { const cart = await this.getCart(userId, guest); await this.prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } }); return this.get(userId, guest); }
  async merge(userId: string, guest: string) { if (!guest) throw new BadRequestException('Guest session is required'); const guestCart=await this.getCart(undefined,guest); const userCart=await this.getCart(userId); for(const item of guestCart.items){const existing=userCart.items.find((i:any)=>i.productId===item.productId&&i.variantId===item.variantId); if(existing) await this.prisma.cartItem.update({where:{id:existing.id},data:{quantity:Math.min(99,existing.quantity+item.quantity)}}); else await this.prisma.cartItem.update({where:{id:item.id},data:{cartId:userCart.id}});} await this.prisma.cart.update({where:{id:guestCart.id},data:{status:'CONVERTED',guestSessionId:null}}); return this.get(userId); }
}
