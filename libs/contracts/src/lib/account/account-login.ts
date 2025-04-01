import { IsEmail, IsString } from "class-validator"

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
        refreshToken!: string;
    }
}