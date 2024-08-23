type BirthdayProfile = {
  name: string;
  isFull: boolean;
  turning: number;
};

type Period = {
  inDays: number;
  formattedDate: string;
  profiles: BirthdayProfile[];
};

type UpcomingBirthdayProcessPayload = {
  email: string;
  periods: Period[];
};

export type { UpcomingBirthdayProcessPayload };
