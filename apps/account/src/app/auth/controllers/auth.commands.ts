import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountLogout, AccountRegister, AccountUpdateTokens } from '@contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthCommands {
    constructor(
        private readonly authService: AuthService, 
    ) {}
    
    @RMQValidate()
    @RMQRoute(AccountRegister.topic)
    async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
        return await this.authService.register(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountLogin.topic)
    async login(@Body() dto: AccountLogin.Request): Promise<AccountLogin.Response> {
        return await this.authService.login(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountUpdateTokens.topic)
    async updateTokens(@Body() dto: AccountUpdateTokens.Request): Promise<AccountUpdateTokens.Response> {
        return await this.authService.updateTokens(dto);
    }

    @RMQValidate()
    @RMQRoute(AccountLogout.topic)
    async logout(@Body() dto: AccountLogout.Request): Promise<AccountLogout.Response> {
        return await this.authService.deleteRefreshToken(dto);
    }
}