import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';
import { dateUtils } from '@/common/utils';

import { ScheduledEventKey } from './constants';

@Injectable()
export class ScheduledEventsService {
  constructor(private dbService: DbService) {}

  start(eventKey: ScheduledEventKey) {
    return this.dbService.scheduledEvent.create({
      data: {
        key: eventKey,
      },
    });
  }

  end(eventId: string) {
    return this.dbService.scheduledEvent.update({
      where: {
        id: eventId,
      },
      data: {
        endAt: dateUtils.getDate().toDate(),
      },
    });
  }
}
