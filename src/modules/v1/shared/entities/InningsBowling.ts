import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MatchInnings } from './MatchInnings';
import { Player } from './Player';

@Entity('innings_bowling')
export class InningsBowling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  innings_id: number;

  @Column()
  player_id: number;

  @Column({ default: 0 })
  over: number;

  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  balls: number;

  @Column({ default: 0 })
  wickets: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  economy: number;

  @Column({ default: false })
  is_current_bowler: boolean;

  @Column()
  tenant_id: number;

  @ManyToOne(() => MatchInnings)
  @JoinColumn({ name: 'innings_id' })
  innings: MatchInnings;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}