import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MailerService, TemplateService } from '@/common';

import { NOTIFICATION_QUEUE, NotificationProcess } from '../constants';
import { UpcomingBirthdayProcessPayload } from '../types/queue';

@Processor(NOTIFICATION_QUEUE)
export class NotificationConsumer extends WorkerHost {
  private logger = new Logger(NotificationConsumer.name);

  constructor(
    private templateService: TemplateService,
    private mailerService: MailerService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case NotificationProcess.UpcomingBirthday: {
        await this.processUpcomingBirthday(job.data);
        break;
      }
      default: {
        this.logger.error(`Unrecognized process name: "${job.name}"`);
      }
    }
  }

  private async processUpcomingBirthday(
    payload: UpcomingBirthdayProcessPayload,
  ) {
    const html = await this.templateService.load('upcoming-birthdays', {
      periods: payload.periods,
    });

    await this.mailerService.sendMail({
      from: 'Birthday | Withlitvinov <reminder@birthday.withlitvinov.com>',
      to: payload.email,
      subject: 'Upcoming birthdays',
      html,
    });
  }
}
