import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ControllerVersionEnum, CookieEnum } from '@/common';
import { dateUtils, ncu } from '@/common/utils';
import { AuthService, Public, SessionService } from '@/modules/auth';
import { TzService } from '@/modules/tz';

import {
  ControllerOpenApi,
  LoginOpenApi,
  LogoutOpenApi,
  RegisterOpenApi,
} from './auth.openapi';
import { CONTROLLER_ROUTE, COOKIE_MAX_EXPIRATION_DAYS } from './constants';
import { requests } from './dtos';
import { buildCookieOptions } from './utils';

const buildSidCookieOptions = () => {
  return buildCookieOptions(
    dateUtils.now().add(COOKIE_MAX_EXPIRATION_DAYS, 'days').toDate(),
  );
};

@ControllerOpenApi
@Controller({
  path: CONTROLLER_ROUTE,
  version: ControllerVersionEnum.V1,
})
export class AuthControllerV1 {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly tzService: TzService,
  ) {}

  @RegisterOpenApi
  @Public()
  @Post('/register')
  async register(@Body() dto: requests.RegisterDto): Promise<void> {
    const leadTz = await this.tzService.resolveLeadZone(dto.time_zone);

    if (!leadTz) {
      throw new BadRequestException(`Wrong time zone '${dto.time_zone}'`);
    }

    await this.authService.registerUser({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      birthday: dto.birthday,
      timeZone: leadTz.id,
    });
  }

  @LoginOpenApi
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: requests.LoginDto,
  ): Promise<void> {
    const user = await this.authService.getUser(dto.email);

    const isAuthorized = await ncu.pipeline([
      user,
      () => this.authService.verifyPassword(user.password, dto.password),
    ]);

    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionService.register(user.id);

    res.cookie(CookieEnum.SID, session.sid, buildSidCookieOptions());
  }

  @LogoutOpenApi
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const sid = req.cookies[CookieEnum.SID];

    if (sid) {
      await this.sessionService.drop(sid);
    }

    res.clearCookie(CookieEnum.SID);
  }
}
