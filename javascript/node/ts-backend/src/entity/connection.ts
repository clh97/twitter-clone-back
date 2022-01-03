import { Connection } from '../types/connection';
import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user';

@Entity()
export class ConnectionEntity implements Connection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @Generated('uuid')
    uuid: string;

    @Column({ nullable: false })
    @JoinColumn({ name: 'user_entity', referencedColumnName: 'id' })
    from: number;

    @Column({ nullable: false })
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_entity', referencedColumnName: 'id' })
    to: number;

    @Column({ nullable: false })
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_entity', referencedColumnName: 'id' })
    createdBy: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
