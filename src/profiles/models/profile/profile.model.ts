import { Injectable } from '@nestjs/common';
import { PersonProfile, Prisma } from '@prisma/client';

import { DbService, type Uuid } from '@/common';

import { GetManyOrderEnum } from './profile.constants';
import { getManyInUpcomingBirthdayOrderSql } from './profile.sql';
import type {
  GetManyOptions,
  InsertOnePayload,
  PartialUpdateByIdPayload,
} from './profile.types';

@Injectable()
export class ProfileModel {
  constructor(private readonly dbService: DbService) {}

  getMany(
    options: GetManyOptions = {
      order: GetManyOrderEnum.NoOrder,
    },
  ) {
    if (options.order === GetManyOrderEnum.UpcomingBirthday) {
      return this.dbService.$queryRaw<PersonProfile[]>(
        getManyInUpcomingBirthdayOrderSql(),
      );
    }

    return this.dbService.personProfile.findMany();
  }

  getById(id: Uuid) {
    return this.dbService.personProfile.findUnique({
      where: { id },
    });
  }

  insertOne(payload: InsertOnePayload) {
    return this.dbService.personProfile.create({
      data: {
        name: payload.name,
        birthday: payload.birthday,
      },
    });
  }

  partialUpdateById(id: Uuid, payload: PartialUpdateByIdPayload) {
    const data: Prisma.PersonProfileUpdateInput = {};

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        data[key] = value;
      }
    });

    return this.dbService.personProfile.update({
      where: {
        id,
      },
      data,
    });
  }

  deleteById(id: Uuid) {
    return this.dbService.personProfile.delete({
      where: {
        id,
      },
    });
  }
}
