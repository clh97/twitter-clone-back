import { User } from '../types/user';
import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { TweetEntity } from './tweet';

@Entity('user')
export class UserEntity implements User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    birthdate: string;

    @OneToMany(() => TweetEntity, (tweet) => tweet.owner)
    tweets: TweetEntity[];

    @ManyToMany(() => TweetEntity, (tweet) => tweet.owner)
    likes: TweetEntity[];

    @Column({ nullable: false })
    @Generated('uuid')
    uuid: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
