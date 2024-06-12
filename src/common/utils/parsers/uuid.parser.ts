import type { uuid } from '../../types';

export const parseUuid = (value: string): uuid => {
  // TODO: Add validation for uuid here
  return value as uuid;
};
