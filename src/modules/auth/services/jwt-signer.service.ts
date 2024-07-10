import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_SECRET,
} from '../auth.constants';

import * as jwtSignerServiceTypes from './jwt-signer.service.types';

@Injectable()
export class JwtSignerService {
  constructor(private jwtService: JwtService) {}

  signAccessToken(payload: jwtSignerServiceTypes.AccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION,
      secret: JWT_ACCESS_TOKEN_SECRET,
    });
  }

  decodeAccessToken(token: string) {
    return this.jwtService.decode<jwtSignerServiceTypes.DecodedAccessTokenPayload>(
      token,
    );
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: JWT_ACCESS_TOKEN_SECRET,
    });
  }

  signRefreshToken(payload: jwtSignerServiceTypes.RefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
      secret: JWT_REFRESH_TOKEN_SECRET,
    });
  }

  decodeRefreshToken(token: string) {
    return this.jwtService.decode<jwtSignerServiceTypes.DecodedRefreshTokenPayload>(
      token,
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: JWT_REFRESH_TOKEN_SECRET,
    });
  }
}
