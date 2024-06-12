export type CreateProfileDto = {
  name: string;
  birthday: {
    day: number;
    month: number;
    year: number | null;
  };
};
