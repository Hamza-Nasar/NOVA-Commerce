import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  wishlist: any;
  cartItem: any;
  cart: any;
  coupon: any;
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
  async enableShutdownHooks(app: INestApplication) {
    process.once('beforeExit', () => { void app.close(); });
  }
}
