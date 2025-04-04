import { AccountGetSession } from '@contracts';
import { IJwtPayloadUser } from '@interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport'
import { RMQService } from 'nestjs-rmq';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly rmqService: RMQService
    ) {
        const secretKey = configService.get('JWT_SECRET_KEY');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey,
        });
    }

    async validate(req: Request, payload: IJwtPayloadUser) {
        const userAgent = req.headers['user-agent'];

        const data = await this.rmqService.send<AccountGetSession.Request, AccountGetSession.Response>(
            AccountGetSession.topic, 
            { 
                id: payload.id,
                agent: userAgent,
            }
        );

        if (!data.userId || data.userId !== payload.id) {
            throw new UnauthorizedException("Access denied. User account not found.");
        }

        if (!data.sessions.some(session => session.token === payload.session)) {
            throw new UnauthorizedException("Session does not exist.");
        }

        return payload
    }
}
