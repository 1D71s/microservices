import { IRefreshToken } from "@interface";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace AccountGetSession {
    export const topic = 'account.get-session.command';

    export class Request {
        @IsNumber()
        @IsNotEmpty()
        id!: number;

        @IsString()
        @IsNotEmpty()
        agent!: string;
    }

    export class Response {
        userId!: number;

        sessions!: IRefreshToken[];
    }
}
