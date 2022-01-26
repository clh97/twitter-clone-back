import { Tweet } from '../types/tweet';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserEntity } from './user';
import { PublicUser } from '../types/user';

@Entity('tweet')
export class TweetEntity implements Tweet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: true })
    @ManyToOne(() => TweetEntity)
    @JoinColumn({ name: 'tweet_reply_entity', referencedColumnName: 'id' })
    replyTo?: number;

    @Column({ nullable: false })
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'tweet_user_createdby_entity', referencedColumnName: 'id' })
    createdBy: number;

    @ManyToOne(() => UserEntity, (user) => user.tweets, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    owner: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.id, { cascade: true })
    @JoinTable({
        joinColumn: {
            name: 'tweet',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id',
        },
    })
    likedBy: PublicUser[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        select: false,
    })
    updatedAt: Date;
}
