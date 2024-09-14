import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

import { l } from '@/common/utils';

const AuthorizedUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const uid = l._.get(req, 'ctx.user.id', null);

    if (uid === null) {
      throw new UnauthorizedException();
    }

    return uid;
  },
);

export { AuthorizedUserId };
