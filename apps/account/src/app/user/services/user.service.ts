import { Injectable } from '@nestjs/common';
import { SessionService } from '../../session/services/session.service';
import { UserRepository } from '../repositories/user.repository';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { IUserWithSessions } from '@interface';
import { AccountGetSession } from '@contracts';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionService: SessionService,
    ) {}

    async getUserSessions(userId: number): Promise<AccountGetSession.Response> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new RMQError('User was not found', ERROR_TYPE.RMQ, 404);
        }

        const sessions = await this.sessionService.getSessionsByUserId(user.id);

        return {
            userId: user.id,
            sessions,
        }
    }
}
