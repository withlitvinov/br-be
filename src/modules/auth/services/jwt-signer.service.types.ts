type BasePayload<P> = P & {
  exp: number;
};

export type AccessTokenPayload = {
  id: string;
};

export type DecodedAccessTokenPayload = BasePayload<AccessTokenPayload>;

export type RefreshTokenPayload = {
  id: string;
};

export type DecodedRefreshTokenPayload = BasePayload<RefreshTokenPayload>;
