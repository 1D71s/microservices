import { IRefreshToken } from "@interface";
import { IsString, IsDate } from "class-validator";

export class RefreshTokenDto implements IRefreshToken  {
    @IsString()
    token!: string;

    @IsDate()
    exp!: Date;

    @IsString()
    userId!: number;

    @IsString()
    userAgent!: string;
}