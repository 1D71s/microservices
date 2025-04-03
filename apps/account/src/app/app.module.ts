import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPGConfig } from './configs/pg.config';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { mongoConfig } from './configs/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "envs/account.env"
        }),
        TypeOrmModule.forRootAsync(getPGConfig()),
        MongooseModule.forRootAsync(mongoConfig()),
        RMQModule.forRootAsync(getRMQConfig()),
        AuthModule,
        UserModule,
        SessionModule,
        RedisModule
    ],
    exports: [TypeOrmModule]
})
export class AppModule {}