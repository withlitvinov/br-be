import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';
import { dateUtils } from '@/common/utils';

import { ScheduledEventKey, ScheduledEventStatus } from './constants';

@Injectable()
export class ScheduledEventsService {
  constructor(private dbService: DbService) {}

  start(eventKey: ScheduledEventKey) {
    return this.dbService.scheduledEvent.create({
      data: {
        status: ScheduledEventStatus.Processing,
        key: eventKey,
      },
    });
  }

  success(eventId: string) {
    return this.dbService.scheduledEvent.update({
      where: {
        id: eventId,
      },
      data: {
        status: ScheduledEventStatus.Succeed,
        endAt: dateUtils.getDate().toDate(),
      },
    });
  }

  fail(eventId: string) {
    return this.dbService.scheduledEvent.update({
      where: {
        id: eventId,
      },
      data: {
        status: ScheduledEventStatus.Failed,
        endAt: dateUtils.getDate().toDate(),
      },
    });
  }
}
