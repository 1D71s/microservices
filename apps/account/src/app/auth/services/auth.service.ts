import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { AccountLogin, AccountLogout, AccountRegister, AccountUpdateTokens } from '@contracts';
import * as bcrypt from 'bcrypt';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { IRefreshToken, ITokens, IUser, UserProvider } from '@interface';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../session/services/session.service';
import { RedisService } from '../../redis/service/redis.service';
import { UserSessionsEnumKey } from '../../user/enums/user_sessions.enum';
import { TokenRepository } from '../../session/repositories/token.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
        private readonly redisService: RedisService,
        private readonly tokensRepository: TokenRepository
    ) {}

    async register(dto: AccountRegister.Request): Promise<{ message: string }> {
        const { email, password } = dto;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new RMQError( 'User with this email already exists', ERROR_TYPE.RMQ, 409 );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.userRepository.create({
            email,
            password: hashedPassword,
            provider: UserProvider.LOCAL,
        });

        return { message: 'User successfully registered' };
    }

    async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { email, password, agent } = dto;

        const existingUser = await this.userRepository.findByEmail(email, { includePassword: true });
        if (!existingUser) {
            throw new RMQError('User was not found', ERROR_TYPE.RMQ, 404);
        }

        if (existingUser.provider !== UserProvider.LOCAL || !bcrypt.compareSync(password, existingUser.password)) {
            throw new RMQError('Incorrect email or password.', ERROR_TYPE.RMQ, 401);
        }

        return await this.generateTokens(existingUser, agent);
    }

    async updateTokens(dto: AccountUpdateTokens.Request): Promise<ITokens> {
        const { refreshToken, agent } = dto;

        await this.removeSessionFromCache(refreshToken);

        const token = await this.tokensRepository.getOneByToken(refreshToken.token);
        
        if (!token) {
            throw new RMQError('Refresh token was not found', ERROR_TYPE.RMQ, 404);
        }
    
        if (new Date(token.exp) < new Date()) {
            throw new RMQError('Refresh token has expired', ERROR_TYPE.RMQ, 401);
        }
        
        await this.tokensRepository.deleteToken(token);
        
        const user = await this.userRepository.findById(token.userId);
        
        if (!user) {
            throw new RMQError('User associated with this token was not found', ERROR_TYPE.RMQ, 404);
        }
    
        return this.generateTokens(user, agent);
    }   
    
    async deleteRefreshToken(dto: AccountLogout.Request): Promise<AccountLogout.Response> {
        const { refreshToken } = dto;

        await this.removeSessionFromCache(refreshToken);

        const deletedToken = await this.tokensRepository.deleteToken(refreshToken);

        if (!deletedToken) {
            throw new RMQError('Refresh token was not found', ERROR_TYPE.RMQ, 404);
        }

        return { result: true };
    }

    private async generateTokens(user: IUser, agent: string): Promise<ITokens> {
        const refreshToken = await this.sessionService.getOrUpdateRefreshToken(user.id, agent);

        await this.addSessionToCache(refreshToken);
          
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            session: refreshToken.token,
        });

        return { accessToken, refreshToken };
    }

    private async addSessionToCache(refreshToken: IRefreshToken): Promise<void> {
        const { userId, token, userAgent } = refreshToken;
        const cacheKey = `${UserSessionsEnumKey.USER_SESSIONS}_${userAgent}:${userId}`;
        
        await this.redisService.set(cacheKey, token, { EX: 604800 });
    }

    async removeSessionFromCache(refreshToken: IRefreshToken): Promise<void> {
        const { userId, userAgent } = refreshToken;

        const cacheKey = `${UserSessionsEnumKey.USER_SESSIONS}_${userAgent}:${userId}`;
        await this.redisService.delete(cacheKey);
    }    
}
