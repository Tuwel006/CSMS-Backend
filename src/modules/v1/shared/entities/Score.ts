import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, CreateDateColumn, Index } from 'typeorm';
import { AppDataSource } from '../../../../config/db';
import { Matches } from './Matches';
import { Player } from './Player';

export enum ExtraType {
  WIDE = 'wide',
  NO_BALL = 'no_ball',
  BYE = 'bye',
  LEG_BYE = 'leg_bye',
  PENALTY = 'penalty'
}

export enum WicketType {
  BOWLED = 'bowled',
  CAUGHT = 'caught',
  LBW = 'lbw',
  STUMPED = 'stumped',
  RUN_OUT = 'run_out',
  HIT_WICKET = 'hit_wicket',
  HANDLED_BALL = 'handled_ball',
  OBSTRUCTING_FIELD = 'obstructing_field',
  TIMED_OUT = 'timed_out'
}

@Entity('scores')
@Index(['match_id', 'innings_no'])
@Index(['match_id', 'innings_no', 'ball'])
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: number;

  @Column()
  innings_no: number;

  @Column('decimal', { precision: 5, scale: 1 })
  ball: number;

  @Column({ nullable: true })
  batsman_id: number;

  @Column({ nullable: true })
  bowler_id: number;

  @Column({ nullable: true })
  non_striker_id: number;

  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  extras: number;

  @Column({ type: 'enum', enum: ExtraType, nullable: true })
  extra_type: ExtraType;

  @Column({ default: false })
  is_wicket: boolean;

  @Column({ type: 'enum', enum: WicketType, nullable: true })
  wicket_type: WicketType;

  @Column({ nullable: true })
  fielder_id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Matches, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'match_id' })
  match: Matches;

  @ManyToOne(() => Player, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'batsman_id' })
  batsman: Player;

  @ManyToOne(() => Player, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'bowler_id' })
  bowler: Player;

  @ManyToOne(() => Player, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'non_striker_id' })
  nonStriker: Player;

  @ManyToOne(() => Player, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'fielder_id' })
  fielder: Player;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async setBall() {
    const repo = AppDataSource.getRepository(Score);

    const lastBall = await repo
      .createQueryBuilder('s')
      .where('s.match_id = :matchId AND s.innings_no = :inningsNo', {
        matchId: this.match_id,
        inningsNo: this.innings_no,
      })
      .orderBy('s.ball', 'DESC')
      .addOrderBy('s.id', 'DESC')
      .getOne();

    if (!lastBall) {
      this.ball = 0.1;
      return;
    }

    // Use integer math to avoid floating point precision issues
    const ballInt = Math.round(lastBall.ball * 10); // Convert to integer (e.g., 0.1 -> 1, 1.5 -> 15)
    const over = Math.floor(ballInt / 10); // Over number
    const ballInOver = ballInt % 10; // Ball in current over (1-6)

    if (ballInOver >= 6) {
      // End of over, start new over
      this.ball = (over + 1) + 0.1;
    } else {
      // Next ball in same over
      this.ball = over + (ballInOver + 1) / 10;
    }
  }
}