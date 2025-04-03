import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthCommands } from './controllers/auth.commands';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';

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
        UserModule,
        SessionModule
    ],
    providers: [
        AuthService,
    ],
    controllers: [
        AuthCommands
    ],
})
export class AuthModule {}