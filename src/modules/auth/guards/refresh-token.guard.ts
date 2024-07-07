import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CookieEnum } from '@/common';

import { JwtSignerService } from '../services';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtSignerService: JwtSignerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies[CookieEnum.RefreshToken];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtSignerService.verifyRefreshToken(refreshToken);
    } catch (ex) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
