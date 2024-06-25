export type GetManyProfilesResponseDto = {
  id: string;
  name: string;
  birthday: string;
  is_full: boolean;
}[];

export type GetByIdProfileResponseDto = {
  id: string;
  name: string;
  birthday: string;
};

export type CreateOneProfileResponseDto = void;

export type DeleteByIdProfileResponseDto = void;
