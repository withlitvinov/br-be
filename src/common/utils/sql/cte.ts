import { parens } from './common';

export const cte = (table: string, expression: string) =>
  `with ${table} as ${parens(expression)}`;
