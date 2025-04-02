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