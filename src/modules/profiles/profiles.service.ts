import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';

import { DbService } from '@/common';
import { DEFAULT_TIME_ZONE } from '@/modules/tz/costants';

import {
  BirthdayMarkerEnum,
  DUMMY_LEAP_YEAR,
  ProfilesOrderEnum,
} from './constants';
import { profilesSql } from './sql';

type RawProfile = {
  name: string;
  birthday: string;
};

type GetManyOptions = Partial<{
  userId: string;
  order: ProfilesOrderEnum;
  tz: string;
}>;

const padStartNumber = (
  number: number,
  replaceWith = '0',
  countOfOrders = 2,
) => {
  return number.toString().padStart(countOfOrders, replaceWith);
};

@Injectable()
export class ProfilesService {
  constructor(private readonly dbService: DbService) {}

  getMany(options: GetManyOptions = {}): Promise<Profile[]> {
    const {
      userId,
      order = ProfilesOrderEnum.Simple,
      tz = DEFAULT_TIME_ZONE,
    } = options;

    if (order === ProfilesOrderEnum.Upcoming) {
      return this.dbService.$queryRawUnsafe<Profile[]>(
        profilesSql.upcoming({
          userId,
          tz,
        }),
      );
    }

    return this.dbService.$queryRawUnsafe<Profile[]>(
      profilesSql.simple({
        userId,
      }),
    );
  }

  get(id: string) {
    return this.dbService.profile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        birthday: true,
        birthdayMarker: true,
      },
    });
  }

  create(userId: string, data: RawProfile) {
    const [y, m, d] = data.birthday.split('-');

    const isYear = y !== '####';
    const birthday = new Date(
      `${isYear ? y : DUMMY_LEAP_YEAR}-${padStartNumber(+m)}-${padStartNumber(+d)}`,
    );
    const birthdayMarker = isYear
      ? BirthdayMarkerEnum.Standard
      : BirthdayMarkerEnum.WithoutYear;

    return this.dbService.profile.create({
      data: {
        name: data.name,
        birthday,
        birthdayMarker,
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        birthday: true,
      },
    });
  }

  delete(id: string) {
    return this.dbService.profile.delete({
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

  /**
   * Check if a profile belongs to a user
   *
   * @param profileId
   * @param userId
   */
  async isBelongToUser(profileId: string, userId: string) {
    return !!(await this.dbService.profile.findUnique({
      where: {
        id: profileId,
        userId: userId,
      },
    }));
  }
}
