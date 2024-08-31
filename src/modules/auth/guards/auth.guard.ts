import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CookieEnum, dateUtils } from '@/common';
import { ncu } from '@/common/utils';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SessionService } from '../services';

@Injectable()
export class AuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Validate session
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    req.ctx = {
      user: null,
    };

    // TODO: Possible to extract cookie retrieval to std func
    const sid = req.cookies[CookieEnum.SID];

    const isValid = await ncu.pipeline([
      sid,
      async () => {
        const session = await this.sessionService.getSession(sid);

        if (session) {
          // Attach user's id to request ctx
          req.ctx.user = {
            id: session.userId,
          };
        }

        return (
          session &&
          dateUtils.getTime(session.expireAt).isAfter(dateUtils.now())
        );
      },
    ]);

    if (isValid === false) {
      res.clearCookie(CookieEnum.SID);
      throw new UnauthorizedException();
    }

    return true;
  }
}
