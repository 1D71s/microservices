import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ])
    ],
    providers: [
        AuthService,
        UserRepository
    ],
    controllers: [
        AuthController
    ],
})
export class AuthModule {}