import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import { MurLockModule } from 'murlock';
import { RedisClientOptions } from 'redis';

import { DbService, MailerService, TemplateService } from './services';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    ScheduleModule.forRoot(),
    MurLockModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('REDIS__HOST');
        const port = +configService.get('REDIS__PORT');
        const password = configService.get('REDIS__PASSWORD');

        const wait = +configService.get('LOCK__WAIT');
        const maxAttempts = +configService.get<number>('LOCK__ATTEMPTS');

        return {
          redisOptions: {
            url: `redis://${host}:${port}`,
            password,
          },
          wait,
          maxAttempts,
          logLevel: 'error',
          ignoreUnlockFail: false,
          lockKeyPrefix: 'custom',
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const host = configService.get('REDIS__HOST');
        const port = +configService.get('REDIS__PORT');
        const password = configService.get('REDIS__PASSWORD');

        return {
          store: redisStore,
          socket: {
            host,
            port,
          },
          password,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get('REDIS__HOST');
        const port = +configService.get('REDIS__PORT');
        const password = configService.get('REDIS__PASSWORD');

        return {
          prefix: 'queue',
          connection: {
            host,
            port,
            password,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DbService, MailerService, TemplateService],
  exports: [DbService, MailerService, TemplateService],
})
export class GlobalModule {}
