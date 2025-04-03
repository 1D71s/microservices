import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";

export namespace AccountLogout {
    export const topic = 'account.logout.command';

    export class Request {
        @ValidateNested()
        @Type(() => RefreshTokenDto)
        refreshToken!: RefreshTokenDto;
    }

    export class Response {
        result!: boolean;
    }
}
