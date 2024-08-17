import { validate, version } from 'uuid';

const UUID_VERSION = 4;

export const isValidUuid = (value: string) => {
  return validate(value) && version(value) === UUID_VERSION;
};
