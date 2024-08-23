const NEUTRAL_API_TAGS = {
  ROOT: 'Root',
};

const V1_API_TAGS = {
  AUTH: 'Auth (v1)',
  PROFILE: 'Profiles (v1)',
  MY: 'My (v1)',
  TZ: 'Time Zone (v1)',
};

const CACHE_KEY_PREFIX = 'cache';

enum CacheKeyEnum {
  RefreshToken = 'refresh_token',
}

export { NEUTRAL_API_TAGS, V1_API_TAGS, CACHE_KEY_PREFIX, CacheKeyEnum };
