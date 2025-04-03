import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        JwtModule.registerAsync(getJWTConfig()),
        PassportModule,    
    ],
    controllers: [
        AuthController
    ],
    providers: [   
        JwtAuthGuard,
        JwtStrategy,
        AuthService,
    ]
})
export class AuthModule {}