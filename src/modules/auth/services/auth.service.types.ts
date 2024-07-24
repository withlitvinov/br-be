type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  timeZone: string;
};

type LoginUserPayload = {
  email: string;
  password: string;
};

export type { RegisterUserPayload, LoginUserPayload };
