import { Module } from '@nestjs/common';

import { ScheduledEventsService } from './scheduled_events.service';

@Module({
  imports: [],
  providers: [ScheduledEventsService],
  exports: [ScheduledEventsService],
})
export class ScheduledEventsModule {}
