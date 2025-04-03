import { Module, Session } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserQueries } from './controllers/user.queries';
import { SessionModule } from '../session/session.module';
import { UserService } from './services/user.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from '../redis/service/redis.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]),
        SessionModule,
        RedisModule
    ],
    controllers: [
        UserQueries
    ],
    providers: [
        RedisService,
        UserService,
        UserRepository
    ],
    exports: [
        UserRepository
    ]
})
export class UserModule {}
