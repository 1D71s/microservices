import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsPasswordsMatching } from "../decorators/match-password.decorator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsPasswordsMatching()
    repeatPassword: string;
}