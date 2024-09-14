import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

type GetManyOptions = {
  timeZones: string[];
};

type NewUser = {
  name: string;
  email: string;
  password: string;
  birthday: Date;
  timeZone: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(nu: NewUser) {
    return this.dbService.user.create({
      data: {
        name: nu.name,
        email: nu.email,
        password: nu.password,
        birthday: nu.birthday,
        config: {
          create: {
            timeZone: nu.timeZone,
          },
        },
      },
      include: {
        config: true,
      },
    });
  }

  getMany(
    options: GetManyOptions = {
      timeZones: [],
    },
  ) {
    const { timeZones } = options;

    return this.dbService.user.findMany({
      where: timeZones.length
        ? {
            config: {
              timeZone: {
                in: timeZones,
              },
            },
          }
        : undefined,
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

  getDetails(uid: string) {
    return this.dbService.user.findUnique({
      where: {
        id: uid,
      },
      include: {
        config: true,
      },
    });
  }

  /**
   * Get user's time zone
   *
   * @param uid
   */
  async getTimeZone(uid: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        id: uid,
      },
      select: {
        config: {
          select: {
            timeZone: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return user.config.timeZone;
  }

  updateName(uid: string, name: string): Promise<void> {
    return void this.dbService.user.update({
      where: {
        id: uid,
      },
      data: {
        name,
      },
    });
  }

  updateTimeZone(uid: string, tz: string): Promise<void> {
    return void this.dbService.user.update({
      where: {
        id: uid,
      },
      data: {
        config: {
          update: {
            timeZone: tz,
          },
        },
      },
    });
  }
}
