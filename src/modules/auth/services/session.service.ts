import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { Result, err, fromPromise, ok } from 'neverthrow';

import { DbService } from '@/common';
import { dateUtils, tsu } from '@/common/utils';

// In days
const MAX_SESSION_DURATION = 60;
// Per user
const MAX_SESSION_COUNT = 5;

const genToken128 = () => {
  return crypto.randomBytes(16).toString('hex');
};

const createHash256 = (v: string) => {
  return crypto.hash('sha256', v);
};

type Session = {
  id: string;
  sid: string;
  createdAt: Date;
  expireAt: Date;
  userId: string;
};

@Injectable()
export class SessionService {
  static errC = {
    UNKNOWN: -1,
  } as const;

  constructor(private dbService: DbService) {}

  async registerSession(
    uid: string,
  ): Promise<Result<Session, tsu.ObjectValues<typeof SessionService.errC>>> {
    const usrSessionCntResult = await fromPromise(
      this.dbService.session.count({
        where: {
          userId: uid,
        },
      }),
      (original) => ({
        original,
        message: 'Failed to count user sessions from db',
      }),
    );

    if (usrSessionCntResult.isErr()) {
      // TODO: Write to error log file
      return err(SessionService.errC.UNKNOWN);
    }

    if (usrSessionCntResult.value >= MAX_SESSION_COUNT) {
      // Flush all sessions
      const delCnt = await fromPromise(
        this.dbService.session.deleteMany({
          where: {
            userId: uid,
          },
        }),
        (original) => ({
          original,
          message: 'Failed to delete user sessions',
        }),
      );

      if (delCnt.isErr()) {
        // TODO: Write to error log file
        return err(SessionService.errC.UNKNOWN);
      }
    }

    const sid = genToken128();
    const hSid = createHash256(sid);
    const expireAt = dateUtils.now().add(MAX_SESSION_DURATION, 'd').toDate();

    const newSessionResult = await fromPromise(
      this.dbService.session.create({
        data: {
          sid: hSid,
          expireAt,
          userId: uid,
        },
        select: {
          id: true,
          createdAt: true,
          expireAt: true,
          userId: true,
        },
      }),
      (original) => ({
        original,
        message: 'Failed to create user session',
      }),
    );

    if (newSessionResult.isErr()) {
      // TODO: Write to error log file
      return err(SessionService.errC.UNKNOWN);
    }

    return ok({
      id: newSessionResult.value.id,
      sid,
      createdAt: newSessionResult.value.createdAt,
      expireAt: newSessionResult.value.expireAt,
      userId: newSessionResult.value.userId,
    });
  }

  async getSession(sid: string) {
    const hSid = createHash256(sid);

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
    const hSid = createHash256(sid);

    await this.dbService.session.deleteMany({
      where: {
        sid: hSid,
      },
    });
  }
}
