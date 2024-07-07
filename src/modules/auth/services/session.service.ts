import { Injectable, UnauthorizedException } from '@nestjs/common';

import { SessionModel } from '../models';
import { JwtSignerService } from '../services';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtSignerService: JwtSignerService,
    private readonly sessionModel: SessionModel,
  ) {}

  async create(userId: string) {
    const {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    } = await this.#createTokens(userId);

    await this.sessionModel.createOne(userId, {
      refreshToken: refreshToken,
      expiresIn: new Date(refreshTokenExpiresIn * 1000),
    });

    return {
      accessToken: accessToken,
      expiresIn: accessTokenExpiresIn,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const session = await this.sessionModel.findByRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException();
    }

    await this.sessionModel.deleteById(session.id);

    const newTokens = await this.#createTokens(session.userId);

    await this.sessionModel.createOne(session.userId, {
      refreshToken: refreshToken,
      expiresIn: new Date(newTokens.refreshTokenExpiresIn * 1000),
    });

    return {
      accessToken: newTokens.accessToken,
      expiresIn: newTokens.refreshTokenExpiresIn,
      refreshToken: refreshToken,
    };
  }

  async expire(refreshToken: string) {
    const session = await this.sessionModel.findByRefreshToken(refreshToken);

    if (!session) {
      return;
    }

    await this.sessionModel.deleteById(session.id);
  }

  async #createTokens(userId: string) {
    const accessToken = await this.jwtSignerService.signAccessToken({
      id: userId,
    });
    const decodedAccessToken =
      this.jwtSignerService.decodeAccessToken(accessToken);
    const refreshToken = await this.jwtSignerService.signRefreshToken({
      id: userId,
      accessToken: accessToken,
    });
    const decodedRefreshToken =
      this.jwtSignerService.decodeRefreshToken(refreshToken);

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: decodedAccessToken.exp,
      refreshToken: refreshToken,
      refreshTokenExpiresIn: decodedRefreshToken.exp,
    };
  }
}
