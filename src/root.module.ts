import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { JwtAuthGuard } from './modules/auth';
import { GlobalModule } from './common';
import { AppModule } from './app';

@Module({
  imports: [GlobalModule, AppModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class RootModule {}
