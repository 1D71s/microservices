import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { IMessage } from "@interface";
import { RMQService } from 'nestjs-rmq';
import { AccountLogin, AccountRegister } from '@contracts';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from '../dtos/login.dto';
import { Response } from "express";
import { UserAgent } from '../decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly rmqService: RMQService
    ) {}

    @Post('register')
    @Throttle({ default: { limit: 1, ttl: 3600000 } })
    async register(@Body() dto: RegisterDto): Promise<IMessage> {
        return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, dto);
    }

    @Post('login')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string): Promise<void> {
        const tokens = await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, { 
            ...dto, agent 
        });

        if (!tokens) {
            throw new BadRequestException(`Invalid data: ${JSON.stringify(dto)}`);
        }

        await this.authService.sendRefreshTokenToCookies(tokens, res);
        res.json({ accessToken: tokens.accessToken });
    }
}