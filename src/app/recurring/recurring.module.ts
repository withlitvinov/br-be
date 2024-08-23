import { Module } from '@nestjs/common';

import { NotificationsModule } from '@/modules/notifications';
import { ProfilesModule } from '@/modules/profiles';
import { TzModule } from '@/modules/tz';
import { UsersModule } from '@/modules/users';

import { UpcomingBirthdayNotifyService } from './services/upcoming-birthday-notify.service';

@Module({
  imports: [NotificationsModule, TzModule, UsersModule, ProfilesModule],
  providers: [UpcomingBirthdayNotifyService],
})
export class RecurringModule {}
