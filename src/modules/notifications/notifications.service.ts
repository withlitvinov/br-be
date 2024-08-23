import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { dateUtils } from '@/common/utils';
import { BirthdayMarkerEnum } from '@/modules/profiles';
import { UsersService } from '@/modules/users';

import { NOTIFICATION_QUEUE, NotificationProcess } from './constants';
import { UpcomingBirthdayProcessPayload } from './types/queue';
import { type BirthdayPeriod } from './types/service';

const getPeriodLabel = (days: number) => {
  if (days === 1) {
    return 'Tomorrow';
  }

  if (days === 7) {
    return 'In week';
  }

  return `In ${days} days`;
};

@Injectable()
export class NotificationsService {
  constructor(
    private usersService: UsersService,
    @InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue,
  ) {}

  async notifyAboutUpcomingBirthdays(
    userId: string,
    birthdayPeriods: BirthdayPeriod[],
  ) {
    const user = await this.usersService.getDetails(userId);

    // TODO: Check if email is verified

    await this.notificationQueue.add(NotificationProcess.UpcomingBirthday, {
      email: user.email,
      periods: birthdayPeriods.map(({ inDays, date, profiles }) => ({
        inDays,
        formattedDate: `${getPeriodLabel(inDays)} (${dateUtils.getDate(date).format('D MMMM')})`,
        profiles: profiles.map((profile) => {
          const isFull = profile.birthdayMarker === BirthdayMarkerEnum.Standard;
          const turning = isFull
            ? dateUtils
                .resetTime(date)
                .diff(
                  dateUtils.getDate(profile.birthday, user.config.timeZone),
                  'y',
                )
            : 0;

          return {
            name: profile.name,
            isFull,
            turning,
          };
        }),
      })),
    } as UpcomingBirthdayProcessPayload);
  }
}
