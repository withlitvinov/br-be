import { Injectable } from '@nestjs/common';
import { PersonProfile } from '@prisma/client';

import { DbService } from '@/common';
import { type uuid } from '@/common';

import {
  BirthdayMarkerEnum,
  DUMMY_LEAP_YEAR,
  ProfilesOrderEnum,
} from '../constants';

import * as profileSqlQueries from './profile.sql';

type InsertOnePayload = {
  name: string;
  birthday: string;
};

type GetManyOptions = Partial<{
  order: ProfilesOrderEnum;
}>;

const padStartNumber = (
  number: number,
  replaceWith = '0',
  countOfOrders = 2,
) => {
  return number.toString().padStart(countOfOrders, replaceWith);
};

@Injectable()
export class ProfileModel {
  constructor(private readonly dbService: DbService) {}

  getMany(
    options: GetManyOptions = {
      order: ProfilesOrderEnum.NoOrder,
    },
  ): Promise<PersonProfile[]> {
    if (options.order === ProfilesOrderEnum.UpcomingBirthday) {
      return this.dbService.$queryRawUnsafe<PersonProfile[]>(
        profileSqlQueries.upcomingBirthdayOrder(),
      );
    }

    return this.dbService.$queryRawUnsafe<PersonProfile[]>(
      profileSqlQueries.noOrder(),
    );
  }

  getById(id: uuid) {
    return this.dbService.personProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        birthday: true,
        birthdayMarker: true,
      },
    });
  }

  insertOne(payload: InsertOnePayload) {
    const [y, m, d] = payload.birthday.split('-');

    const isYear = y !== '####';
    const birthday = new Date(
      `${isYear ? y : DUMMY_LEAP_YEAR}-${padStartNumber(+m)}-${padStartNumber(+d)}`,
    );
    const birthdayMarker = isYear
      ? BirthdayMarkerEnum.Standard
      : BirthdayMarkerEnum.WithoutYear;

    return this.dbService.personProfile.create({
      data: {
        name: payload.name,
        birthday,
        birthdayMarker,
      },
      select: {
        id: true,
        name: true,
        birthday: true,
      },
    });
  }

  deleteById(id: uuid) {
    return this.dbService.personProfile.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        birthday: true,
      },
    });
  }
}
