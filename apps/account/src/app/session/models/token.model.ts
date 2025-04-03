import { IRefreshToken } from '@interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'tokens', timestamps: false }) 
export class Token extends Document implements IRefreshToken {
    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ type: Date, required: true })
    exp: Date;

    @Prop({ required: true })
    userId: number;

    @Prop({ required: true })
    userAgent: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
