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

@Entity('innings_batting')
export class InningsBatting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  innings_id: number;

  @Column()
  player_id: number;

  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  balls: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  strike_rate: number;

  @Column({ default: 0 })
  fours: number;

  @Column({ default: 0 })
  sixes: number;

  @Column({ default: false })
  is_striker: boolean;

  @Column({ default: false })
  is_out: boolean;

  @Column({ default: false })
  ret_hurt: boolean;

  @Column({ nullable: true })
  wicket_type: string;

  @Column({ nullable: true })
  fielder_id: number;

  @Column({ nullable: true })
  bowler_id: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  dismissal_over: number;

  @Column()
  tenant_id: number;

  @Column({ nullable: true })
  order: number;

  @ManyToOne(() => MatchInnings)
  @JoinColumn({ name: 'innings_id' })
  innings: MatchInnings;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'bowler_id' })
  bowler: Player;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'fielder_id' })
  fielder: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
