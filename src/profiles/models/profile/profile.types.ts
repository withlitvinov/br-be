import { GetManyOrderEnum } from './profile.constants';

export type InsertOnePayload = {
  name: string;
  birthday: Date;
};

export type PartialUpdateByIdPayload = Partial<{
  name: string;
  birthday: Date;
}>;

export type GetManyOptions = {
  order: GetManyOrderEnum;
};
