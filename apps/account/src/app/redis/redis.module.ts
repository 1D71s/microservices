import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { redisConfig } from '../configs/redis.config';
import { RedisService } from './service/redis.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService) => {
                const options = redisConfig(configService);
                return new Redis(options);
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [
        RedisService,
        'REDIS_CLIENT'
    ], 
})
export class RedisModule {}
