import { SeparatorEnum, join } from './common';

export const where = (condition: string) => `where ${condition}`;

export enum WhereOperatorEnum {
  Gt = '>',
  Gte = '>=',
  Lt = '<',
  Lte = '<=',
  Eq = '=',
  Btw = 'between',
}

export const wcondition = (
  column: string,
  operator: WhereOperatorEnum,
  value: any,
) => {
  if (operator === WhereOperatorEnum.Btw) {
    const [lo, ro] = value;

    return join([column, operator, join([lo, ro], SeparatorEnum.And)]);
  }

  return join([column, operator, value]);
};
