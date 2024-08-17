import { Module } from '@nestjs/common';

import { ProfilesModule } from '@/modules/profiles';
import { TzModule } from '@/modules/tz';
import { UsersModule } from '@/modules/users';

import { UpcomingBirthdayNotifyService } from './services/upcoming-birthday-notify.service';

@Module({
  imports: [TzModule, UsersModule, ProfilesModule],
  providers: [UpcomingBirthdayNotifyService],
})
export class RecurringModule {}
