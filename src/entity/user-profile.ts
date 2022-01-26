import { UserProfile } from '../types/user-profile';
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
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user';

@Entity('profile')
export class UserProfileEntity implements UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => UserEntity, (user) => user.profile)
    user: UserEntity;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    biography: string;

    @Column({ default: 'default-image.webp' })
    profileImage: string;

    @Column({ default: 'default-background-image.webp' })
    profileBackgroundImage: string;

    @Column({ default: '' })
    profileTheme: string;

    @Column({ nullable: false })
    @Generated('uuid')
    uuid: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;
}
