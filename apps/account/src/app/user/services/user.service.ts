import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { AccountGetSession } from '@contracts';
import { RedisService } from '../../redis/service/redis.service';
import { UserSessionsEnumKey } from '../enums/user_sessions.enum';
import { TokenRepository } from '../../session/repositories/token.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokensRepository: TokenRepository,
        private readonly redisService: RedisService
    ) {}

    async getUserSession(dto: AccountGetSession.Request): Promise<AccountGetSession.Response> {
        const { id, agent } = dto;
        const cacheKey = `${UserSessionsEnumKey.USER_SESSIONS}_${agent}:${id}`;

        const cachedSessions = await this.redisService.get(cacheKey);

        if (cachedSessions) {
            try {
                const token = JSON.parse(cachedSessions);
                return {
                    userId: id,
                    token,
                };
            } catch (error) {
                await this.redisService.delete(cacheKey);
            }
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new RMQError('User was not found', ERROR_TYPE.RMQ, 404);
        }

        const session = await this.tokensRepository.getSessionByUserId(user.id, agent);

        if (!session) {
            throw new RMQError('Session was not found', ERROR_TYPE.RMQ, 404);
        }

        return {
            userId: user.id,
            token: session.token,
        }
    }
}
