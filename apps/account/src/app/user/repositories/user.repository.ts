import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AccountRegister } from '@contracts';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) {}

    async findByEmail(email: string, options?: { includePassword?: boolean }): Promise<UserEntity | null> {
        const { includePassword = false } = options || {};

        const query = this.repository.createQueryBuilder('user')
            .where('user.email = :email', { email });

        if (includePassword) {
            query.addSelect('user.password');
        }

        return query.getOne();
    }

    async create(dto: AccountRegister.Request): Promise<UserEntity> {
        return this.repository.save(dto);
    }
}