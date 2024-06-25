export enum SeparatorEnum {
  CommaSpace = ', ',
  Space = ' ',
  And = ' and ',
  Or = ' or ',
}

export const join = (values: string[], separator = SeparatorEnum.Space) =>
  values.join(separator);

export const parens = (expression: string) => `(${expression})`;

export const and = (expressions: string[]) =>
  parens(join(expressions.map(parens), SeparatorEnum.And));

export const or = (expressions: string[]) =>
  parens(join(expressions.map(parens), SeparatorEnum.Or));

export const as = (expression: string, name: string) =>
  `${parens(expression)} as "${name}"`;

export const makeDate = (year: string, month: string, day: string) =>
  `make_date(${join([year, month, day], SeparatorEnum.CommaSpace)})`;

export enum ConditionOperatorEnum {
  Gt = '>',
  Gte = '>=',
  Lt = '<',
  Lte = '<=',
  Eq = '=',
}

export const condition = (
  lo: string,
  operator: ConditionOperatorEnum,
  ro: any,
) => {
  return join([lo, operator, ro]);
};

export enum ExtractOperatorEnum {
  Year = 'year',
  Month = 'month',
  Day = 'day',
}

export const extract = (operator: ExtractOperatorEnum, column: string) =>
  join([operator, 'from', column]);
