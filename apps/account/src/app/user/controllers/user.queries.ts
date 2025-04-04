import { Body, Controller } from '@nestjs/common';
import { AccountGetSession } from '@contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserService } from '../services/user.service';

@Controller()
export class UserQueries {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @RMQValidate()
    @RMQRoute(AccountGetSession.topic)
    async getUserWithSession(@Body() dto: AccountGetSession.Request ): Promise<AccountGetSession.Response> {
        return await this.userService.getUserSessions(dto);
    }
}