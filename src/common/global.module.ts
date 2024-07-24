import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import { MurLockModule } from 'murlock';
import { RedisClientOptions } from 'redis';

import { DbService } from './services';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    MurLockModule.forRoot({
      redisOptions: {
        url: 'redis://redis.birthday-reminder-local.orb.local:6379',
        password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
      },
      wait: 500,
      maxAttempts: 3,
      logLevel: 'error',
      ignoreUnlockFail: false,
      lockKeyPrefix: 'custom',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'redis.birthday-reminder-local.orb.local',
        port: 6379,
      },
      password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
      isGlobal: true,
    }),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class GlobalModule {}
