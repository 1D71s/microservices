import { Injectable } from '@nestjs/common';
import { Token } from '../models/token.model';
import { TokenRepository } from '../repositories/token.repository';
import { IRefreshToken } from '@interface';
import { DeleteResult } from 'mongoose';

@Injectable()
export class SessionService {
    constructor(
        private readonly tokensRepository: TokenRepository
    ) {}

    async getSessionsByUserId(userId: number): Promise<Token[]> {
        return await this.tokensRepository.getSessionsByUserId(userId);
    }

    async getOneByToken(token: string): Promise<Token | null> {
        return await this.tokensRepository.getOneByToken(token); 
    }

    async deleteToken(token: IRefreshToken): Promise<DeleteResult> {
        return await this.tokensRepository.deleteToken(token);
    }

    public async getOrUpdateRefreshToken(userId: number, agent: string): Promise<Token> {
        const existingToken = await this.tokensRepository.findByUserAndAgent(userId, agent);

        return existingToken
            ? this.tokensRepository.updateToken(existingToken)
            : this.tokensRepository.createToken(userId, agent);
    }
}
