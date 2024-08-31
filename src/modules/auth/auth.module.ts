import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from '@/modules/users';

import { AuthGuard } from './guards';
import { AuthService, SessionService } from './services';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    SessionService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService, SessionService, AuthGuard],
})
export class AuthModule {}
