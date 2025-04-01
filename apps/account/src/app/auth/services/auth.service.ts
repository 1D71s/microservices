import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/repositories/user.repository';
import { AccountRegister } from '@contracts';
import * as bcrypt from 'bcrypt';
import { RMQError } from 'nestjs-rmq';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
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
        });

        return { message: 'User successfully registered' };
    }
}
