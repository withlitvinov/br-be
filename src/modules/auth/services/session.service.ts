import { Injectable } from '@nestjs/common';

import { SessionModel } from '../models';
import { JwtSignerService } from '../services';

import * as sessionServiceTypes from './session.service.types';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtSignerService: JwtSignerService,
    private readonly sessionModel: SessionModel,
  ) {}

  async createTokens(
    userId: string,
  ): Promise<sessionServiceTypes.SessionTokens> {
    const accessToken = await this.jwtSignerService.signAccessToken({
      id: userId,
    });
    const decodedAccessToken =
      this.jwtSignerService.decodeAccessToken(accessToken);
    const refreshToken = await this.jwtSignerService.signRefreshToken({
      id: userId,
    });
    const decodedRefreshToken =
      this.jwtSignerService.decodeRefreshToken(refreshToken);

    await this.sessionModel.createOne(userId, {
      refreshToken: refreshToken,
      expiresIn: new Date(decodedRefreshToken.exp * 1000),
    });

    return {
      accessToken,
      accessTokenExpiresIn: decodedAccessToken.exp,
      refreshToken,
      refreshTokenExpiresIn: decodedRefreshToken.exp,
    };
  }

  async expireSession(refreshToken: string) {
    const session = await this.sessionModel.findByRefreshToken(refreshToken);

    if (!session) {
      return null;
    }

    await this.sessionModel.deleteById(session.id);

    return session.userId;
  }
}
