import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
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
}