import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async addRecentlyViewed(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, status: 'ACTIVE', publishedAt: { not: null } } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.recentlyViewedProduct.upsert({ where: { userId_productId: { userId, productId } }, update: { viewedAt: new Date() }, create: { userId, productId } });
    const rows = await this.prisma.recentlyViewedProduct.findMany({ where: { userId }, orderBy: { viewedAt: 'desc' }, skip: 20 });
    if (rows.length) await this.prisma.recentlyViewedProduct.deleteMany({ where: { id: { in: rows.map((row) => row.id) } } });
    return { recorded: true };
  }

  listRecentlyViewed(userId: string) {
    return this.prisma.recentlyViewedProduct.findMany({ where: { userId, product: { status: 'ACTIVE', publishedAt: { not: null } } }, orderBy: { viewedAt: 'desc' }, take: 20, include: { product: true } });
  }
}
