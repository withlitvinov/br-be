import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

type GetManyOptions = {
  timeZones: string[];
};

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

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
    });
  }

  getDetails(userId: string) {
    return this.dbService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        config: true,
      },
    });
  }

  /**
   * Get user's time zone
   *
   * @param userId
   */
  async getTimeZone(userId: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        id: userId,
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

  async updateName(userId: string, name: string) {
    await this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    });
  }

  async updateTimeZone(userId: string, timeZone: string) {
    await this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        config: {
          update: {
            timeZone,
          },
        },
      },
    });
  }
}
