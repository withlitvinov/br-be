import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private mailer: Transporter;

  constructor(private configService: ConfigService) {
    const host = configService.get('SMTP__HOST');
    const port = +configService.get('SMTP__PORT');
    const secure = configService.get('SMTP__SECURE') === 'true';
    const user = configService.get('SMTP__USER');
    const password = configService.get('SMTP__PASSWORD');
    const rateDelta = +configService.get('SMTP__RATE_DELTA');
    const rateLimit = +configService.get('SMTP__RATE_LIMIT');

    this.mailer = createTransport({
      pool: true,
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
      rateDelta,
      rateLimit,
    });
  }

  sendMail(options: SendMailOptions) {
    return this.mailer.sendMail(options);
  }
}
