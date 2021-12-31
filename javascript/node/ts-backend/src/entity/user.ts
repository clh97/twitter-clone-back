import { User } from '../types/user';
import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { TweetEntity } from './tweet';

@Entity()
export class UserEntity implements User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    birthdate: string;

    @Column({ nullable: false })
    @Generated('uuid')
    uuid: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
