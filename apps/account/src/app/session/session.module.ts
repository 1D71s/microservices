import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './models/token.model';
import { TokenRepository } from './repositories/token.repository';
import { SessionService } from './services/session.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Token', schema: TokenSchema }
        ])
    ],
    providers: [
        TokenRepository,
        SessionService
    ],
    exports: [
        SessionService
    ]
})
export class SessionModule {}
