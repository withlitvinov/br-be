import { SeparatorEnum, join } from './common';

export const select = (columns: string[], from: string) =>
  join(['select', join(columns, SeparatorEnum.CommaSpace), 'from', from]);
