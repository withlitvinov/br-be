import { Profile } from '@prisma/client';

import { dateUtils } from '@/common/utils';

type BirthdayPeriod = {
  /**
   * Birthday date
   */
  date: dateUtils.dayjs.Dayjs;
  /**
   * Birthday in days
   */
  inDays: number;
  /**
   * Profiles which have a birthday in this date
   */
  profiles: Profile[];
};

export type { BirthdayPeriod };
