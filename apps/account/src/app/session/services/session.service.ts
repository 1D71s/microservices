import { Injectable } from '@nestjs/common';
import { Token } from '../models/token.model';
import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class SessionService {
    constructor(
        private readonly tokensRepository: TokenRepository
    ) {}

    public async getOrUpdateRefreshToken(userId: number, agent: string): Promise<Token> {
        const existingToken = await this.tokensRepository.findByUserAndAgent(userId, agent);

        return existingToken
            ? this.tokensRepository.updateToken(existingToken)
            : this.tokensRepository.createToken(userId, agent);
    }
}
