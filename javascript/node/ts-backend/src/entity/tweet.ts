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
} from 'typeorm';
import { UserEntity } from './user';

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

    @ManyToOne(() => UserEntity, (user) => user.tweets)
    @JoinColumn({ name: 'createdBy' })
    owner: UserEntity;

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
