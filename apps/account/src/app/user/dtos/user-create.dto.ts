import { UserProvider } from "@interface";

export interface IUserCreateDTO {
    email: string;
    password: string;
    provider: UserProvider;
}
