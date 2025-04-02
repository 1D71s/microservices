import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../models/token.model';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>
    ) {}

    async findByUserAndAgent(userId: string, userAgent: string): Promise<Token | null> {
        return this.tokenModel.findOne({ userId, userAgent }).exec();
    }

    async createToken(userId: string, userAgent: string): Promise<Token> {
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
        token.exp = add(new Date(), { days: 15 });
        return token.save();
    }
}
