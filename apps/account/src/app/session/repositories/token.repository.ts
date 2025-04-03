import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { Token } from '../models/token.model';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { IRefreshToken } from '@interface';

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>
    ) {}

    async getSessionsByUserId(userId: number): Promise<Token[]> {
        return await this.tokenModel.find({ userId }).exec(); 
    }

    async getOneByToken(token: string): Promise<Token | null> {
        return this.tokenModel.findOne({ token }).exec(); 
    }

    async findByUserAndAgent(userId: number, userAgent: string): Promise<Token | null> {
        return this.tokenModel.findOne({ userId, userAgent }).exec();
    }

    async createToken(userId: number, userAgent: string): Promise<Token> {
        const newToken = new this.tokenModel({
            token: uuidv4(),
            exp: add(new Date(), { months: 1 }),
            userId,
            userAgent,
        });

        return newToken.save();
    }

    async updateToken(token: Token): Promise<Token> {
        token.token = uuidv4();
        token.exp = add(new Date(), { days: 30 });
        return token.save();
    }

    async deleteToken(refreshToken: IRefreshToken): Promise<DeleteResult> {
        return await this.tokenModel.deleteOne({ token: refreshToken.token }).exec();
    }
}
