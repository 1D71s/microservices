import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";

export namespace AccountUpdateTokens {
    export const topic = 'account.update-tokens.command';

    export class Request {
        @ValidateNested()
        @Type(() => RefreshTokenDto)
        refreshToken!: RefreshTokenDto;

        @IsString()
        agent!: string;
    }

    export class Response {
        accessToken!: string;
        refreshToken!: RefreshTokenDto;
    }
}
