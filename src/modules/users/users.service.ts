import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

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
      select: {
        id: true,
      },
    });
  }
}
