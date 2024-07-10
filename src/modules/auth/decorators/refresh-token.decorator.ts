import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

import { CookieEnum } from '@/common';

/**
 * Use this decorator within RefreshTokenRequired decorator
 */
export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const refreshToken = req.cookies[CookieEnum.RefreshToken];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return refreshToken;
  },
);
