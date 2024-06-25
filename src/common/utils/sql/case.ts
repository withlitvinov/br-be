import { join, parens } from './common';

// $ used to avoid conflict with JS' reserved keyword "case"
export const $case = (whenExpressions: string[], thenExpression: string) =>
  join(['case', join(whenExpressions), 'else', parens(thenExpression), 'end']);

export const whenthen = (whenExpression: string, thenExpression: string) =>
  `when ${whenExpression} then ${thenExpression}`;
