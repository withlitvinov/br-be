import { join } from './common';

export const order = (condition: string) => `order by ${condition}`;

export enum OrderOperatorEnum {
  Asc = 'asc',
  Desc = 'desc',
}

export const ocondition = (column: string, operator: OrderOperatorEnum) =>
  join([column, operator]);
