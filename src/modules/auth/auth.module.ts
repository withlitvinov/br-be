import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './strategies';
import { UserModel, SessionModel } from './models';
import { AuthService, JwtSignerService, SessionService } from './services';

const MODELS = [UserModel, SessionModel] as const;
const SERVICES = [AuthService, SessionService, JwtSignerService] as const;
const SERVICES_TO_EXPORT = [
  AuthService,
  SessionService,
  JwtSignerService,
] as const;
const STRATEGIES = [JwtStrategy] as const;

@Module({
  imports: [PassportModule],
  providers: [...MODELS, ...SERVICES, ...STRATEGIES],
  exports: [...SERVICES_TO_EXPORT],
})
export class AuthModule {}
