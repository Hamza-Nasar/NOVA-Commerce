import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';

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
        WEB_ORIGIN: Joi.string()
          .custom((value: string, helpers) => {
            const origins = value.split(',').map((origin) => origin.trim()).filter(Boolean);
            const invalid = origins.some((origin) => {
              try {
                new URL(origin);
                return false;
              } catch {
                return true;
              }
            });
            return origins.length && !invalid ? value : helpers.error('string.uri');
          })
          .required(),
        JWT_ACCESS_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN_DAYS: Joi.number().integer().positive().default(30),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    BullModule.forRootAsync({ useFactory: (config: ConfigService) => ({ connection: { url: config.getOrThrow('REDIS_URL') } }), inject: [ConfigService] }),
    DatabaseModule,
    QueueModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    HealthModule,
  ],
})
export class AppModule {}
