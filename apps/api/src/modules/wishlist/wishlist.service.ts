import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type WishlistItemInput = {
  productId: string;
  variantId?: string;
};

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  private get(userId: string) {
    return this.prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { items: { include: { product: true, variant: true } } },
    });
  }

  list(userId: string) {
    return this.get(userId);
  }

  async add(userId: string, body: WishlistItemInput) {
    const product = await this.prisma.product.findFirst({
      where: { id: body.productId, status: 'ACTIVE', publishedAt: { not: null } },
      include: { variants: true },
    });

    if (!product) throw new NotFoundException('Product not found or inactive');

    if (
      body.variantId &&
      !product.variants.some((variant) => variant.id === body.variantId && variant.status === 'ACTIVE')
    ) {
      throw new NotFoundException('Variant not found or inactive');
    }

    const wishlist = await this.get(userId);

    try {
      await this.prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: product.id,
          variantId: body.variantId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Product already in wishlist');
      }

      throw error;
    }

    return this.get(userId);
  }

  async remove(userId: string, id: string) {
    const wishlist = await this.get(userId);

    if (!wishlist.items.some((item) => item.id === id)) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishlistItem.delete({ where: { id } });
    return this.get(userId);
  }

  async moveToCart(userId: string, id: string) {
    const wishlist = await this.get(userId);
    const item = wishlist.items.find((wishlistItem) => wishlistItem.id === id);

    if (!item) throw new NotFoundException('Wishlist item not found');

    const product = await this.prisma.product.findFirst({
      where: { id: item.productId, status: 'ACTIVE', publishedAt: { not: null } },
      include: { variants: true },
    });

    if (!product) throw new BadRequestException('Product is no longer available');

    const variant = item.variantId
      ? product.variants.find(
          (productVariant) =>
            productVariant.id === item.variantId && productVariant.status === 'ACTIVE',
        )
      : null;

    if (item.variantId && !variant) {
      throw new BadRequestException('Variant is no longer available');
    }

    const cart = await this.prisma.cart.upsert({
      where: { userId_status: { userId, status: 'ACTIVE' } },
      create: { userId },
      update: {},
    });

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: item.productId, variantId: item.variantId },
    });

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Math.min(99, existing.quantity + 1) },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: 1,
          unitPriceSnapshot: variant?.price ?? product.basePrice,
        },
      });
    }

    await this.prisma.wishlistItem.delete({ where: { id } });
    return { cartId: cart.id };
  }
}
