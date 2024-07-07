export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  birthday: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};
