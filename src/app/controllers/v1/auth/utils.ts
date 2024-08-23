import { CookieOptions } from 'express';

const buildCookieOptions = (expires?: Date): CookieOptions => {
  const isDev = process.env.NODE_ENV === 'development';

  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    expires,
  };

  if (isDev) {
    options.sameSite = 'lax';
    options.secure = false;
  }

  return options;
};

const buildCacheKey = (key: string, value: string) => {
  return `cache:${key}:${value}`;
};

export { buildCookieOptions, buildCacheKey };
