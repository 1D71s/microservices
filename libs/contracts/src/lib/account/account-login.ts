import { IsEmail, IsString } from "class-validator";
import { IRefreshToken } from "@interface";

export namespace AccountLogin {
    export const topic = 'account.login.command';

    export class Request {
        @IsEmail()
        email!: string;

        @IsString()
        password!: string;

        @IsString()
        agent!: string;
    }

    export class Response {
        accessToken!: string;
        refreshToken!: IRefreshToken;
    }
}