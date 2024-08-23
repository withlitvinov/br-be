import { Module } from '@nestjs/common';

import { NotificationsModule } from '@/modules/notifications';
import { ProfilesModule } from '@/modules/profiles';
import { ScheduledEventsModule } from '@/modules/scheduled_events';
import { TzModule } from '@/modules/tz';
import { UsersModule } from '@/modules/users';

import { UpcomingBirthdaysAnnouncementSchedule } from './schedules/upcoming_birthdays_announcement.schedule';

@Module({
  imports: [
    ScheduledEventsModule,
    NotificationsModule,
    TzModule,
    UsersModule,
    ProfilesModule,
  ],
  providers: [UpcomingBirthdaysAnnouncementSchedule],
})
export class RecurringModule {}
