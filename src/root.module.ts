import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppModule } from './app';
import { GlobalModule } from './common';
import { JwtAuthGuard } from './modules/auth';

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
