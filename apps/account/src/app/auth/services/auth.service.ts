import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { AccountLogin, AccountRegister } from '@contracts';
import * as bcrypt from 'bcrypt';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { ITokens, IUser, UserProvider } from '@interface';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../session/services/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) {}

    async register(dto: AccountRegister.Request): Promise<{ message: string }> {
        const { email, password } = dto;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new RMQError( 'User with this email already exists', ERROR_TYPE.RMQ, 409 );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.userRepository.create({
            email,
            password: hashedPassword,
            provider: UserProvider.LOCAL,
        });

        return { message: 'User successfully registered' };
    }

    async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
        const { email, password, agent } = dto;

        const existingUser = await this.userRepository.findByEmail(email);
        if (!existingUser) {
            throw new RMQError('User was not found', ERROR_TYPE.RMQ, 404);
        }

        if (existingUser.provider !== UserProvider.LOCAL || !bcrypt.compareSync(password, existingUser.password)) {
            throw new RMQError('Incorrect email or password.', ERROR_TYPE.RMQ, 401);
        }

        return this.generateTokens(existingUser, agent);
    }

    private async generateTokens(user: IUser, agent: string): Promise<ITokens> {
        const refreshToken = await this.sessionService.getOrUpdateRefreshToken(String(user.id), agent);
        
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            session: refreshToken.token,
        });

        return { accessToken, refreshToken };
    }
}
