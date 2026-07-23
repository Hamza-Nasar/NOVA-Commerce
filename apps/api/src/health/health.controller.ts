import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}
  @Get()
  async check() {
    await Promise.all([this.prisma.$queryRaw`SELECT 1`, this.redis.client.ping()]);
    return { status: 'ok', timestamp: new Date().toISOString(), services: { database: 'up', redis: 'up' } };
  }
}
