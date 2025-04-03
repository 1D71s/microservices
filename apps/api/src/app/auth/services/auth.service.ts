import { IAccessToken, ITokens, RefreshTokenEnum } from '@interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor() {}

    async sendRefreshTokenToCookies(tokens: ITokens, res: Response): Promise<IAccessToken> {
        if (!tokens) {
            throw new UnauthorizedException()
        }

        res.cookie(RefreshTokenEnum.REFRESH_TOKEN, tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            path: '/'
        })

        return { accessToken: tokens.accessToken }
    }
}