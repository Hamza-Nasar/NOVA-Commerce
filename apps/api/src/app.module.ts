import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import * as Joi from 'joi';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().port().default(4000),
        API_PREFIX: Joi.string().default('api/v1'),
        DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
        REDIS_URL: Joi.string().uri({ scheme: ['redis', 'rediss'] }).required(),
        WEB_ORIGIN: Joi.string().uri().required(),
      }),
    }),
    BullModule.forRootAsync({ useFactory: (config: ConfigService) => ({ connection: { url: config.getOrThrow('REDIS_URL') } }), inject: [ConfigService] }),
    DatabaseModule,
    QueueModule,
    HealthModule,
  ],
})
export class AppModule {}
