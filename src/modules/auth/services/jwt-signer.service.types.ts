type BasePayload<P> = P & {
  exp: number;
};

type AccessTokenPayload = {
  id: string;
};

type DecodedAccessTokenPayload = BasePayload<AccessTokenPayload>;

type RefreshTokenPayload = {
  id: string;
};

type DecodedRefreshTokenPayload = BasePayload<RefreshTokenPayload>;

export {
  AccessTokenPayload,
  DecodedAccessTokenPayload,
  RefreshTokenPayload,
  DecodedRefreshTokenPayload,
};
