import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from './User';

export enum PlayerRole {
  BATSMAN = 'batsman',
  BOWLER = 'bowler',
  ALLROUNDER = 'allrounder',
  WICKETKEEPER = 'wicketkeeper'
}

@Entity('players')
@Index(['user_id'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  full_name: string;

  @Column({ type: 'enum', enum: PlayerRole })
  role: PlayerRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}