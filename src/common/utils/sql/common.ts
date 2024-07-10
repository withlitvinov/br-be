enum SeparatorEnum {
  CommaSpace = ', ',
  Space = ' ',
  And = ' and ',
  Or = ' or ',
}

const join = (values: string[], separator = SeparatorEnum.Space) =>
  values.join(separator);

const parens = (expression: string) => `(${expression})`;

const and = (expressions: string[]) =>
  parens(join(expressions.map(parens), SeparatorEnum.And));

const or = (expressions: string[]) =>
  parens(join(expressions.map(parens), SeparatorEnum.Or));

const as = (expression: string, name: string) =>
  `${parens(expression)} as "${name}"`;

const makeDate = (year: string, month: string, day: string) =>
  `make_date(${join([year, month, day], SeparatorEnum.CommaSpace)})`;

enum ConditionOperatorEnum {
  Gt = '>',
  Gte = '>=',
  Lt = '<',
  Lte = '<=',
  Eq = '=',
}

const condition = (lo: string, operator: ConditionOperatorEnum, ro: any) => {
  return join([lo, operator, ro]);
};

enum ExtractOperatorEnum {
  Year = 'year',
  Month = 'month',
  Day = 'day',
}

const extract = (operator: ExtractOperatorEnum, column: string) =>
  join([operator, 'from', column]);

export {
  SeparatorEnum,
  join,
  parens,
  and,
  or,
  as,
  makeDate,
  ConditionOperatorEnum,
  condition,
  ExtractOperatorEnum,
  extract,
};
