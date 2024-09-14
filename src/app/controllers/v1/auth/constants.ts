const CONTROLLER_ROUTE = '/auth';

// See more: https://http.dev/set-cookie#max-age:~:text=max%2Dage%20attribute%20to%20400%20days
const COOKIE_MAX_EXPIRATION_DAYS = 400;

const SESSION_TOKEN_LOCK_KEY = 'lock:session_token';

const SESSION_TOKEN_LOCK_RELEASE_TIME = 5000;

export {
  CONTROLLER_ROUTE,
  COOKIE_MAX_EXPIRATION_DAYS,
  SESSION_TOKEN_LOCK_KEY,
  SESSION_TOKEN_LOCK_RELEASE_TIME,
};
