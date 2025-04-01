import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPGConfig } from './configs/pg.config';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "envs/account.env"
        }),
        TypeOrmModule.forRootAsync(getPGConfig()),
        RMQModule.forRootAsync(getRMQConfig()),
        AuthModule,
        UserModule
    ],
    exports: [TypeOrmModule]
})
export class AppModule {}