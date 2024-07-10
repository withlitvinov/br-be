import { join } from './common';

const order = (condition: string) => `order by ${condition}`;

enum OrderOperatorEnum {
  Asc = 'asc',
  Desc = 'desc',
}

const ocondition = (column: string, operator: OrderOperatorEnum) =>
  join([column, operator]);

export { order, OrderOperatorEnum, ocondition };
