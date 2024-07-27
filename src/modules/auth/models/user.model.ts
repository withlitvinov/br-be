import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

import * as types from './user.model.types';

@Injectable()
export class UserModel {
  constructor(private readonly dbService: DbService) {}

  create(payload: types.CreateUserPayload) {
    return this.dbService.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        birthday: payload.birthday,
        config: {
          create: {
            timeZone: payload.timeZone,
          },
        },
      },
      include: {
        config: true,
      },
    });
  }

  getById(id: string) {
    return this.dbService.user.findUnique({
      where: {
        id,
      },
      include: {
        config: true,
      },
    });
  }

  getByEmail(email: string) {
    return this.dbService.user.findUnique({
      where: {
        email,
      },
      include: {
        config: true,
      },
    });
  }
}
