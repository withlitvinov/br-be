import { Injectable } from '@nestjs/common';
import { Prisma, PersonProfile } from '@prisma/client';

import { DbService } from '@/services';

interface CreatePersonProfilePayload {
  name: string;
  birthday: string;
}

interface UpdatePersonProfilePayload {
  name?: string;
  birthday?: string;
}

export enum PersonProfileOrder {
  NoOrder = 0,
  UpcomingBirthday = 1,
}

type GetAllOptions = {
  order: PersonProfileOrder;
};

// TODO:
//  1. Add limit and offset.

@Injectable()
export class PersonProfileModel {
  constructor(private readonly db: DbService) {}

  getAll(
    options: GetAllOptions = {
      order: PersonProfileOrder.NoOrder,
    },
  ) {
    if (options.order === PersonProfileOrder.UpcomingBirthday) {
      return this.db.$queryRaw<PersonProfile[]>(
        this._findManyInUpcomingBirthdayOrderSql(),
      );
    }

    return this.db.personProfile.findMany();
  }

  getById(id: string) {
    return this.db.personProfile.findUnique({
      where: { id },
    });
  }

  create(payload: CreatePersonProfilePayload) {
    return this.db.personProfile.create({
      data: {
        name: payload.name,
        birthday: new Date(payload.birthday),
      },
    });
  }

  partialUpdate(id: string, payload: UpdatePersonProfilePayload) {
    const data: Prisma.PersonProfileUpdateInput = {};

    if (payload.name) {
      data.name = payload.name;
    }

    if (payload.birthday) {
      data.birthday = payload.birthday;
    }

    return this.db.personProfile.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return this.db.personProfile.delete({
      where: {
        id,
      },
    });
  }

  private _findManyInUpcomingBirthdayOrderSql() {
    return Prisma.sql`WITH
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
  }
}
