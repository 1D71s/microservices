import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUserCreateDTO } from '../dtos/user-create.dto';

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

    async create(dto: IUserCreateDTO): Promise<UserEntity> {
        return this.repository.save(dto);
    }

    async findById(id: number): Promise<UserEntity | null> {
        return this.repository.findOneBy({ id }); 
    }
}