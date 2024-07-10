import { Injectable } from '@nestjs/common';
import { PersonProfile } from '@prisma/client';

import { DbService, type uuid } from '@/common';

import {
  BirthdayMarkerEnum,
  ProfilesOrderEnum,
  DUMMY_LEAP_YEAR,
} from '../constants';

import * as profileSqlQueries from './profile.sql';

type InsertOnePayload = {
  name: string;
  birthday: {
    year: number | null;
    month: number;
    day: number;
  };
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
    const birthday = new Date(
      `${payload.birthday.year ? payload.birthday.year : DUMMY_LEAP_YEAR}-${padStartNumber(payload.birthday.month)}-${padStartNumber(payload.birthday.day)}`,
    );
    const birthdayMarker = payload.birthday.year
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
