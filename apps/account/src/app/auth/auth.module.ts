import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserRepository } from '../user/repositories/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionService } from '../session/services/session.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '5m' },
            }),
        }),
        UserModule
    ],
    providers: [
        AuthService,
    ],
    controllers: [
        AuthController
    ],
})
export class AuthModule {}