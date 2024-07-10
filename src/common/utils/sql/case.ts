import { join, parens } from './common';

// $ used to avoid conflict with JS' reserved keyword "case"
const $case = (whenExpressions: string[], thenExpression: string) =>
  join(['case', join(whenExpressions), 'else', parens(thenExpression), 'end']);

const whenthen = (whenExpression: string, thenExpression: string) =>
  `when ${whenExpression} then ${thenExpression}`;

export { $case, whenthen };
