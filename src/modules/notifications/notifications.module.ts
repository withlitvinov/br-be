import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/users';

import { NOTIFICATION_QUEUE } from './constants';
import { NotificationsService } from './notifications.service';
import { NotificationConsumer } from './queue/consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
    UsersModule,
  ],
  providers: [NotificationsService, NotificationConsumer],
  exports: [NotificationsService],
})
export class NotificationsModule {}
