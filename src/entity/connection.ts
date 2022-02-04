import { Connection } from '../types/connection';
import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user';

@Entity('connection')
export class ConnectionEntity implements Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: false })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'connection_user_from_entity', referencedColumnName: 'id' })
  from: number;

  @Column({ nullable: false })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'connection_user_to_entity', referencedColumnName: 'id' })
  to: number;

  @Column({ nullable: false })
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'connection_user_owner_entity', referencedColumnName: 'id' })
  createdBy: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
