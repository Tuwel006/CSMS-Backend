import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Matches } from './Matches';

@Entity('match_status')
@Index(['match_id', 'innings_no'], { unique: true })
export class MatchStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: number;

  @Column()
  innings_no: number;

  @Column({ default: 0 })
  total_runs: number;

  @Column({ default: 0 })
  total_wickets: number;

  @Column('decimal', { precision: 4, scale: 1, default: 0.0 })
  balls_bowled: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0.00 })
  current_run_rate: number;

  @Column({ default: 0 })
  required_runs: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0.00 })
  required_run_rate: number;

  @Column({ default: 0 })
  target: number;

  @Column({ default: 0 })
  extras: number;

  @Column({ default: 0 })
  wides: number;

  @Column({ default: 0 })
  no_balls: number;

  @Column({ default: 0 })
  byes: number;

  @Column({ default: 0 })
  leg_byes: number;

  @Column({ default: 0 })
  penalties: number;

  @ManyToOne(() => Matches, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'match_id' })
  match: Matches;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}