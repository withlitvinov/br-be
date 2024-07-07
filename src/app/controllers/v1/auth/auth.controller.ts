import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
import { Response } from 'express';

import { ControllerVersionEnum, CookieEnum } from '@/common';
import {
  Public,
  AuthService,
  SessionService,
  RefreshToken,
  CheckRefreshToken,
} from '@/modules/auth';

import { V1_API_TAGS } from '../../../constants';
import { request, response } from './dtos';

const PATH_PREFIX = '/auth';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.AUTH)
export class AuthControllerV1 {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
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
  async register(@Body() dto: request.RegisterDto) {
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

    const { accessToken, expiresIn, refreshToken } =
      await this.sessionService.create(user.id);

    res.cookie(CookieEnum.RefreshToken, refreshToken, { httpOnly: true });

    return {
      access_token: accessToken,
      expires_in: expiresIn,
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
  ) {
    await this.sessionService.expire(refreshToken);

    res.clearCookie(CookieEnum.RefreshToken);
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
  async refreshTokens(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.sessionService.refresh(refreshToken);

    res.cookie(CookieEnum.RefreshToken, session.refreshToken, {
      httpOnly: true,
    });

    return {
      access_token: session.accessToken,
      expires_in: session.expiresIn,
    };
  }
}
