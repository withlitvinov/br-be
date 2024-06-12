export type CreateProfileDto = {
  name: string;
  birthday: string;
};

export type UpdateProfileDto = Partial<{
  name: string;
  birthday: string;
}>;
