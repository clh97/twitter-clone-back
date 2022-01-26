import { User } from '../types/user';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Generated,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { TweetEntity } from './tweet';
import { UserProfileEntity } from './user-profile';

@Entity('user')
export class UserEntity implements User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ unique: true, nullable: false, select: false })
    email: string;

    @Column({ select: false })
    birthdate: string;

    @OneToOne(() => UserProfileEntity)
    @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
    profile: UserProfileEntity;

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
