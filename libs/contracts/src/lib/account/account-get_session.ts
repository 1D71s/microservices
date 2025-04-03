import { IRefreshToken } from "@interface";
import { IsNotEmpty, IsNumber } from "class-validator";

export namespace AccountGetSession {
    export const topic = 'account.get-session.command';

    export class Request {
        @IsNumber()
        @IsNotEmpty()
        id!: number;
    }

    export class Response {
        userId!: number;

        sessions!: IRefreshToken[];
    }
}
