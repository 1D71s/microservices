import { IRefreshToken } from "../session/tokens.interface";

export enum UserProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
}

export interface IUser {
    id: number;
    email: string;
    password: string;
    provider: UserProvider;
}

export interface IUserWithSessions extends IUser {
    sessions: IRefreshToken[];
}