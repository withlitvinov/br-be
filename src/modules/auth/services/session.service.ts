import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';
import { dateUtils } from '@/common/utils';

// In days
const MAX_SESSION_DURATION = 60;

const genRndToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

const createHash = (v: string) => {
  return crypto.hash('sha256', v);
};

@Injectable()
export class SessionService {
  constructor(private dbService: DbService) {}

  async register(userId: string) {
    const sid = genRndToken();
    const hSid = createHash(sid);
    const expireAt = dateUtils.now().add(MAX_SESSION_DURATION, 'd').toDate();

    const session = await this.dbService.session.create({
      data: {
        sid: hSid,
        expireAt,
        userId,
      },
      select: {
        id: true,
        createdAt: true,
        expireAt: true,
        userId: true,
      },
    });

    return {
      id: session.id,
      sid,
      createdAt: session.createdAt,
      expireAt: session.expireAt,
      userId: session.userId,
    };
  }

  async getSession(sid: string) {
    const hSid = createHash(sid);

    return this.dbService.session.findFirst({
      where: {
        sid: hSid,
      },
      select: {
        id: true,
        createdAt: true,
        expireAt: true,
        userId: true,
      },
    });
  }

  async drop(sid: string) {
    const hSid = createHash(sid);

    await this.dbService.session.deleteMany({
      where: {
        sid: hSid,
      },
    });
  }
}
