import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RedisModule } from '../../redis/redis.module';
import { AdminCatalogController } from './admin-catalog.controller';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [AdminCatalogController, CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
