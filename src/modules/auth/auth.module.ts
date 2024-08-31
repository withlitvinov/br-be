import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthGuard } from './guards';
import { UserModel } from './models';
import { AuthService, SessionService } from './services';

@Module({
  imports: [],
  providers: [
    UserModel,
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
