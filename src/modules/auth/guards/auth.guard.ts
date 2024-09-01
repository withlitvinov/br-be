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

    // TODO: Possible to extract cookie retrieval to some std func
    const sid = req.cookies[CookieEnum.SID];

    const isValid = await ncu.pipeline([
      sid,
      async () => {
        const sessionResult = await this.sessionService.getSession(sid);

        if (sessionResult.isOk() && sessionResult.value) {
          req.ctx.user = {
            id: sessionResult.value.userId,
          };

          return dateUtils
            .getTime(sessionResult.value.expireAt)
            .isAfter(dateUtils.now());
        }

        return false;
      },
    ]);

    if (isValid === false) {
      res.clearCookie(CookieEnum.SID);
      throw new UnauthorizedException();
    }

    return true;
  }
}
