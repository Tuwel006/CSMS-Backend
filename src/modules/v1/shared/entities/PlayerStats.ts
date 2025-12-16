import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Match } from './Match';
import { Player } from './Player';

@Entity('player_stats')
@Index(['match_id', 'player_id'], { unique: true })
export class PlayerStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: string;

  @Column()
  player_id: number;

  // Batting stats
  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  balls_faced: number;

  @Column({ default: 0 })
  fours: number;

  @Column({ default: 0 })
  sixes: number;

  @Column({ default: false })
  is_out: boolean;

  // Bowling stats
  @Column({ default: 0 })
  wickets: number;

  @Column('decimal', { precision: 4, scale: 1, default: 0.0 })
  overs_bowled: number;

  @Column({ default: 0 })
  runs_conceded: number;

  @Column({ default: 0 })
  maidens: number;

  @Column({ default: 0 })
  wides: number;

  @Column({ default: 0 })
  no_balls: number;

  // Fielding stats
  @Column({ default: 0 })
  catches: number;

  @Column({ default: 0 })
  run_outs: number;

  @Column({ default: 0 })
  stumpings: number;

  @ManyToOne(() => Match, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => Player, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}