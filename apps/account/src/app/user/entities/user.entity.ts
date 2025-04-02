import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { IUser, UserProvider } from '@interface';

@Entity({ name: 'users' })
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'enum', enum: UserProvider, nullable: false })
    provider: UserProvider;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
