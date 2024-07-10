import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { MurLock } from 'murlock';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { ControllerVersionEnum, CookieEnum } from '@/common';
import {
  Public,
  AuthService,
  SessionService,
  RefreshToken,
  CheckRefreshToken,
} from '@/modules/auth';
import * as sessionServiceTypes from '@/modules/auth/services/session.service.types';

import { V1_API_TAGS } from '../../../constants';
import { request, response } from './dtos';

const PATH_PREFIX = '/auth';

const SESSION_TOKENS_LOCK_KEY = 'lock:session_tokens';
// TODO: Make manageable by environment variables
const SESSION_TOKENS_TTL = 5 * 1000; // 5 sec
const getSessionTokensCacheKey = (refreshToken: string) =>
  `cache:session_tokens:${refreshToken}`;

const getCookieOptions = (): CookieOptions => {
  const isDev = process.env.NODE_ENV === 'development';

  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  if (isDev) {
    options.sameSite = 'lax';
    options.secure = false;
  }

  return options;
};

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.AUTH)
export class AuthControllerV1 {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: 'Register new user',
  })
  @ApiBody({
    type: request.RegisterDto,
  })
  @ApiOkResponse()
  @ApiConflictResponse()
  @Public()
  @Post('/register')
  async register(@Body() dto: request.RegisterDto): Promise<void> {
    await this.authService.registerUser({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      birthday: dto.birthday,
    });
  }

  @ApiOperation({
    summary: 'Login',
  })
  @ApiBody({
    type: request.LoginDto,
  })
  @ApiOkResponse({
    type: response.LoginDto,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: request.LoginDto,
  ): Promise<response.LoginDto> {
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

    res.cookie(CookieEnum.RefreshToken, refreshToken, getCookieOptions());

    return {
      access_token: accessToken,
      expires_in: accessTokenExpiresIn,
    };
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @Public()
  @CheckRefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.sessionService.expireSession(refreshToken);
    await this.cacheManager.del(getSessionTokensCacheKey(refreshToken));

    res.clearCookie(CookieEnum.RefreshToken, getCookieOptions());
  }

  @ApiOperation({
    summary: 'Refresh session',
  })
  @ApiOkResponse({
    type: response.RefreshTokenDto,
  })
  @Public()
  @CheckRefreshToken()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  @MurLock(5000, SESSION_TOKENS_LOCK_KEY, '0')
  async refreshTokens(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response.RefreshTokenDto> {
    const sessionTokensCacheKey = getSessionTokensCacheKey(refreshToken);

    const cachedSessionTokens =
      await this.cacheManager.get<sessionServiceTypes.SessionTokens>(
        sessionTokensCacheKey,
      );

    if (cachedSessionTokens) {
      res.cookie(
        CookieEnum.RefreshToken,
        cachedSessionTokens.refreshToken,
        getCookieOptions(),
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

    const newSessionTokensCacheKey = getSessionTokensCacheKey(
      session.refreshToken,
    );

    await this.cacheManager.set(
      sessionTokensCacheKey,
      session,
      SESSION_TOKENS_TTL,
    );
    await this.cacheManager.set(
      newSessionTokensCacheKey,
      session,
      SESSION_TOKENS_TTL,
    );

    res.cookie(
      CookieEnum.RefreshToken,
      session.refreshToken,
      getCookieOptions(),
    );

    return {
      access_token: session.accessToken,
      expires_in: session.accessTokenExpiresIn,
    };
  }
}
