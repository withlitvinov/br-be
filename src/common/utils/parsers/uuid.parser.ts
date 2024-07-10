import { validate, version } from 'uuid';

import { type uuid } from '@/common';

const UUID_VERSION = 4;

export const parseUuid = (value: string): uuid => {
  if (validate(value) && version(value) === UUID_VERSION) {
    return value as uuid;
  }

  throw new Error('Invalid uuid');
};
