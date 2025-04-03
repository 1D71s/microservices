import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private redis: Redis;

    constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {
        this.redis = redisClient;
    }

    async set(key: string, value: string, options?: { EX?: number; PX?: number }): Promise<void> {
        if (options?.EX !== undefined) {
            await this.redis.set(key, value, 'EX', options.EX);
        } else if (options?.PX !== undefined) {
            await this.redis.set(key, value, 'PX', options.PX);
        } else {
            await this.redis.set(key, value);
        }
    }    
    
    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async delete(key: string): Promise<boolean> {
        const result = await this.redis.del(key);
        return result === 1;
    }
}
