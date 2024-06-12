import { Injectable } from '@nestjs/common';
import { PersonProfile, Prisma } from '@prisma/client';

import { DbService, type uuid } from '@/common';

import {
  BirthdayMarkerEnum,
  ProfilesOrderEnum,
  DUMMY_LEAP_YEAR,
} from '../constants';

const SELECT_PROFILES_IN_UPCOMING_BIRTHDAY_ORDER_SQL = Prisma.sql`WITH
  modified_person_profiles AS (
    SELECT
      *,
      (
        CASE
          WHEN (
            EXTRACT(
              MONTH
              FROM
                birthday
            ) > EXTRACT(
              MONTH
              FROM
                CURRENT_DATE
            )
          )
          OR (
            EXTRACT(
              MONTH
              FROM
                birthday
            ) = EXTRACT(
              MONTH
              FROM
                CURRENT_DATE
            )
            AND EXTRACT(
              DAY
              FROM
                birthday
            ) >= EXTRACT(
              DAY
              FROM
                CURRENT_DATE
            )
          ) THEN MAKE_DATE(
            EXTRACT(
              YEAR
              FROM
                CURRENT_DATE
            )::INT,
            EXTRACT(
              MONTH
              FROM
                birthday
            )::INT,
            EXTRACT(
              DAY
              FROM
                birthday
            )::INT
          )
          ELSE MAKE_DATE(
            EXTRACT(
              YEAR
              FROM
                CURRENT_DATE
            )::INT + 1,
            EXTRACT(
              MONTH
              FROM
                birthday
            )::INT,
            EXTRACT(
              DAY
              FROM
                birthday
            )::INT
          )
        END
      ) AS upcoming_birthday
    FROM
      person_profiles
  )
SELECT
  id,
  name,
  birthday
FROM
  modified_person_profiles
ORDER BY
  upcoming_birthday ASC;`;

type InsertOnePayload = {
  name: string;
  birthday: {
    year: number | null;
    month: number;
    day: number;
  };
};

type GetManyOptions = {
  order: ProfilesOrderEnum;
};

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
  ) {
    if (options.order === ProfilesOrderEnum.UpcomingBirthday) {
      return this.dbService.$queryRaw<PersonProfile[]>(
        SELECT_PROFILES_IN_UPCOMING_BIRTHDAY_ORDER_SQL,
      );
    }

    return this.dbService.personProfile.findMany({
      select: {
        id: true,
        name: true,
        birthday: true,
      },
    });
  }

  getById(id: uuid) {
    return this.dbService.personProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        birthday: true,
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
