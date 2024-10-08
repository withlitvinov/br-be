import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { dateUtils } from '@/common/utils';
import { NotificationsService } from '@/modules/notifications';
import { ProfilesOrderEnum, ProfilesService } from '@/modules/profiles';
import {
  ScheduledEventKey,
  ScheduledEventsService,
} from '@/modules/scheduled_events';
import { TzService } from '@/modules/tz';
import { UsersService } from '@/modules/users';

const NOTIFY_HOUR = 8; // Notify at hour (local time)
const DAYS_UNTIL_BIRTHDAY = [7, 3, 1];

const getNextBirthdayDate = (
  base: dateUtils.dayjs.Dayjs,
  birthday: dateUtils.dayjs.Dayjs,
) => {
  let result = dateUtils.getDate(birthday);

  const baseY = base.year();
  const baseM = base.month();
  const baseD = base.date();
  const m = result.month();
  const d = result.date();

  if (m > baseM || (m === baseM && d >= baseD)) {
    result = result.year(baseY);
  } else {
    result = result.year(baseY + 1);
  }

  return result;
};

@Injectable()
export class UpcomingBirthdaysAnnouncementSchedule
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    UpcomingBirthdaysAnnouncementSchedule.name,
  );

  constructor(
    private scheduledEventsService: ScheduledEventsService,
    private tzService: TzService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private notificationsService: NotificationsService,
  ) {}

  onApplicationBootstrap() {
    /*
    TODO:
    Since the notification process is only launched at the beginning of the hour (12:00, 13:00, 14:00, but not 12:01, 13:32, etc.), some users may not be notified by the scheduler during an emergency server reboot.
    Therefore, when restarting, it is necessary to check whether the user notification was launched and processed in the last hour.
     */
  }

  @Cron(CronExpression.EVERY_HOUR)
  async notifyUsers() {
    this.logger.debug('START_UPCOMING_BIRTHDAY_NOTICING');

    const scheduledEvent = await this.scheduledEventsService.start(
      ScheduledEventKey.UpcomingBirthdaysAnnouncement,
    );

    try {
      const execTime = dateUtils.now();

      const tzs = await this.tzService.getTimeZones();

      const tzsToNotify = [] as typeof tzs;

      // Find time zones which should be notified at NOTIFY_TIME
      for (const tz of tzs) {
        const tzTime = dateUtils.getTime(execTime, tz.id);
        const h = tzTime.hour();

        if (h === NOTIFY_HOUR) {
          tzsToNotify.push(tz);
        }
      }

      if (tzsToNotify.length > 0) {
        const usersToNotify = await this.usersService.getMany({
          timeZones: tzsToNotify.map(({ id }) => id),
        });

        if (usersToNotify.length > 0) {
          // Notify each user
          for (const user of usersToNotify) {
            const profiles = await this.profilesService.getMany({
              userId: user.id,
              order: ProfilesOrderEnum.Simple,
            });

            const execTimeLocal = dateUtils.getTime(
              execTime,
              user.config.timeZone,
            );

            const birthdayPeriods: {
              [key: number]: {
                date: dateUtils.dayjs.Dayjs;
                profiles: typeof profiles;
              };
            } = [];

            // Collect profiles that need to be notified to the user
            for (const profile of profiles) {
              // Calc next birthday date
              const nextBirthday = getNextBirthdayDate(
                execTimeLocal,
                dateUtils.getDate(profile.birthday),
              );

              const daysBeforeBirth = nextBirthday.diff(
                dateUtils.resetTime(execTimeLocal),
                'd',
              );

              if (DAYS_UNTIL_BIRTHDAY.includes(daysBeforeBirth)) {
                if (!birthdayPeriods[daysBeforeBirth]) {
                  birthdayPeriods[daysBeforeBirth] = {
                    date: nextBirthday,
                    profiles: [profile],
                  };
                } else {
                  birthdayPeriods[daysBeforeBirth].profiles.push(profile);
                }
              }
            }

            if (Object.keys(birthdayPeriods).length > 0) {
              await this.notificationsService.notifyAboutUpcomingBirthdays(
                user.id,
                Object.entries(birthdayPeriods).map(([inDays, period]) => ({
                  inDays: +inDays,
                  date: period.date,
                  profiles: period.profiles,
                })),
              );
            } else {
              this.logger.debug(
                `NO_PROFILES_TO_NOTIFY User - ${user.name}, ID - ${user.id}`,
              );
            }
          }
        } else {
          this.logger.debug('NO_USERS_TO_NOTIFY');
        }
      } else {
        this.logger.debug('NO_TIME_ZONES_TO_NOTIFY');
      }

      await this.scheduledEventsService.success(scheduledEvent.id);
    } catch (ex: unknown) {
      this.logger.error(ex);
      await this.scheduledEventsService.fail(scheduledEvent.id);
    }

    this.logger.debug('END_UPCOMING_BIRTHDAY_NOTICING');
  }
}
