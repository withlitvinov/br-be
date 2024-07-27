import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

import { JwtPayload } from '@/modules/auth';

export const DJwtPayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const jwtPayload = req.user as JwtPayload;

    if (!jwtPayload) {
      throw new UnauthorizedException();
    }

    return jwtPayload;
  },
);
