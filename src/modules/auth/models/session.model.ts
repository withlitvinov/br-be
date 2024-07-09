import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

import * as sessionModelTypes from './session.model.types';

@Injectable()
export class SessionModel {
  constructor(private readonly dbService: DbService) {}

  findByRefreshToken(refreshToken: string) {
    return this.dbService.session.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  createOne(userId: string, payload: sessionModelTypes.CreatePayload) {
    return this.dbService.session.create({
      data: {
        refreshToken: payload.refreshToken,
        expiresIn: payload.expiresIn,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  deleteById(id: string) {
    return this.dbService.session.delete({
      where: {
        id,
      },
    });
  }
}
