import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MurLock } from 'murlock';

import { ControllerVersionEnum, CookieEnum } from '@/common';
import { dateUtils } from '@/common/utils';
import {
  AuthService,
  CheckRefreshToken,
  Public,
  RefreshToken,
  SessionService,
} from '@/modules/auth';
import * as sessionServiceTypes from '@/modules/auth/services/session.service.types';
import { TzService } from '@/modules/tz';

import { CacheKeyEnum } from '../../../constants';

import {
  ControllerOpenApi,
  LoginOpenApi,
  RefreshSessionOpenApi,
  RegisterOpenApi,
} from './auth.openapi';
import {
  CONTROLLER_ROUTE,
  COOKIE_MAX_EXPIRATION_DAYS,
  SESSION_TOKEN_LOCK_KEY,
  SESSION_TOKEN_LOCK_RELEASE_TIME,
} from './constants';
import { requests, responses } from './dtos';
import { buildCacheKey, buildCookieOptions } from './utils';

const buildRefreshCookieCacheKey = (token: string) => {
  return buildCacheKey(CacheKeyEnum.RefreshToken, token);
};

const buildRefreshCookieOptions = () => {
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
  private sessionTokensTtl = 0;

  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly tzService: TzService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.sessionTokensTtl = configService.get('SESSION_TOKENS_TTL');
  }

  @RegisterOpenApi
  @Public()
  @Post('/register')
  async register(@Body() dto: requests.RegisterDto) {
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
  ): Promise<responses.LoginDto> {
    const user = await this.authService.getUser(dto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await this.authService.verifyPassword(
      user.password,
      dto.password,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const { accessToken, accessTokenExpiresIn, refreshToken } =
      await this.sessionService.createTokens(user.id);

    res.cookie(
      CookieEnum.RefreshToken,
      refreshToken,
      buildRefreshCookieOptions(),
    );

    return {
      access_token: accessToken,
      expires_in: accessTokenExpiresIn,
    };
  }

  @LoginOpenApi
  @Public()
  @CheckRefreshToken() // TODO: Merge with @RefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.sessionService.expireSession(refreshToken);
    await this.cacheManager.del(buildRefreshCookieCacheKey(refreshToken));

    res.clearCookie(CookieEnum.RefreshToken);
  }

  @RefreshSessionOpenApi
  @Public()
  @CheckRefreshToken() // TODO: Merge with @RefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @MurLock(SESSION_TOKEN_LOCK_RELEASE_TIME, SESSION_TOKEN_LOCK_KEY, '0')
  async refreshTokens(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<responses.RefreshTokenDto> {
    const sessionTokensCacheKey = buildRefreshCookieCacheKey(refreshToken);

    const cachedSessionTokens =
      await this.cacheManager.get<sessionServiceTypes.SessionTokens>(
        sessionTokensCacheKey,
      );

    if (cachedSessionTokens) {
      res.cookie(
        CookieEnum.RefreshToken,
        cachedSessionTokens.refreshToken,
        buildRefreshCookieOptions(),
      );

      return {
        access_token: cachedSessionTokens.accessToken,
        expires_in: cachedSessionTokens.accessTokenExpiresIn,
      };
    }

    const sessionUserId = await this.sessionService.expireSession(refreshToken);

    if (!sessionUserId) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionService.createTokens(sessionUserId);

    const newSessionTokensCacheKey = buildRefreshCookieCacheKey(
      session.refreshToken,
    );

    await this.cacheManager.set(
      sessionTokensCacheKey,
      session,
      this.sessionTokensTtl,
    );
    await this.cacheManager.set(
      newSessionTokensCacheKey,
      session,
      this.sessionTokensTtl,
    );

    res.cookie(
      CookieEnum.RefreshToken,
      session.refreshToken,
      buildRefreshCookieOptions(),
    );

    return {
      access_token: session.accessToken,
      expires_in: session.accessTokenExpiresIn,
    };
  }
}
