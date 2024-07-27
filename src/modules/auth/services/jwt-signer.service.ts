import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as jwtSignerServiceTypes from './jwt-signer.service.types';

@Injectable()
export class JwtSignerService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  signAccessToken(payload: jwtSignerServiceTypes.AccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT__ACCESS_TOKEN_EXPIRATION'),
      secret: this.configService.get('JWT__ACCESS_TOKEN_SECRET'),
    });
  }

  decodeAccessToken(token: string) {
    return this.jwtService.decode<jwtSignerServiceTypes.DecodedAccessTokenPayload>(
      token,
    );
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT__ACCESS_TOKEN_SECRET'),
    });
  }

  signRefreshToken(payload: jwtSignerServiceTypes.RefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT__REFRESH_TOKEN_EXPIRATION'),
      secret: this.configService.get('JWT__REFRESH_TOKEN_SECRET'),
    });
  }

  decodeRefreshToken(token: string) {
    return this.jwtService.decode<jwtSignerServiceTypes.DecodedRefreshTokenPayload>(
      token,
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT__REFRESH_TOKEN_SECRET'),
    });
  }
}
