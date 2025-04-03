import { Controller, Post, Body, BadRequestException, Res, UnauthorizedException, Get, UseGuards, HttpStatus, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { IMessage, IRefreshToken, RefreshTokenEnum } from "@interface";
import { RMQService } from 'nestjs-rmq';
import { AccountLogin, AccountLogout, AccountRegister, AccountUpdateTokens } from '@contracts';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from '../dtos/login.dto';
import { Response } from "express";
import { UserAgent } from '../decorators/user-agent.decorator';
import { Cookie } from '../decorators/cookie.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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

    @Get('tokens/update')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async updateTokens(@Cookie(RefreshTokenEnum.REFRESH_TOKEN) refreshToken: IRefreshToken, @Res() res: Response, @UserAgent() agent: string): Promise<void> {
        if (!refreshToken) {
            throw new UnauthorizedException('There are not data for update tokens');
        }
        const tokens = await this.rmqService.send<AccountUpdateTokens.Request, AccountUpdateTokens.Response>(AccountUpdateTokens.topic, { 
            refreshToken, agent 
        });

        if (!tokens) {
            throw new UnauthorizedException("Problem with update tokens");
        }

        this.authService.sendRefreshTokenToCookies(tokens, res);
        res.json({ accessToken: tokens.accessToken });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(@Cookie(RefreshTokenEnum.REFRESH_TOKEN) refreshToken: IRefreshToken, @Res() res: Response): Promise<void> {
        if (!refreshToken) {
            res.sendStatus(HttpStatus.OK);
            return;
        }
        const deletedToken = await this.rmqService.send<AccountLogout.Request, AccountLogout.Response>(AccountLogout.topic, { refreshToken });

        if (!deletedToken) {
            throw new UnauthorizedException();
        }
        
        res.cookie(RefreshTokenEnum.REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
        res.sendStatus(HttpStatus.OK);
    }
}