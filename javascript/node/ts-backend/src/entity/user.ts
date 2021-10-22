import { User } from '../types/user';
import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity()
export class UserEntity implements User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column()
    birthdate: Date;

    @Column()
    @Generated('uuid')
    uuid: string;
}
