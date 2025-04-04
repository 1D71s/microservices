import { Injectable } from '@nestjs/common';
import { SessionService } from '../../session/services/session.service';
import { UserRepository } from '../repositories/user.repository';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { AccountGetSession } from '@contracts';
import { RedisService } from '../../redis/service/redis.service';
import { UserSessionsEnumKey } from '../enums/user_sessions.enum';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionService: SessionService,
        private readonly redisService: RedisService
    ) {}

    async getUserSessions(dto: AccountGetSession.Request): Promise<AccountGetSession.Response> {
        const { id, agent } = dto;
        const cacheKey = `${UserSessionsEnumKey.USER_SESSIONS}_${agent}:${id}`;

        const cachedSessions = await this.redisService.get(cacheKey);

        if (cachedSessions) {
            try {
                const sessions = JSON.parse(cachedSessions);
                return {
                    userId: id,
                    sessions,
                };
            } catch (error) {
                await this.redisService.delete(cacheKey);
            }
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new RMQError('User was not found', ERROR_TYPE.RMQ, 404);
        }

        const sessions = await this.sessionService.getSessionsByUserId(user.id, agent);

        return {
            userId: user.id,
            sessions,
        }
    }
}
