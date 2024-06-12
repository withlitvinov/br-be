export type CreateOneProfileRequestDto = {
  name: string;
  birthday: {
    day: number;
    month: number;
    year: number | null;
  };
};
