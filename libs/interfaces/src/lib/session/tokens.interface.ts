export interface IRefreshToken {
    token: string;
    exp: Date;
    userId: string;
    userAgent: string;
}

export interface IAccessToken {
    accessToken: string;
}

export interface ITokens extends IAccessToken {
    refreshToken: IRefreshToken;
}