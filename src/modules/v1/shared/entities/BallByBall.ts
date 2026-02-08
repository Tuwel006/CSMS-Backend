import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MatchInnings } from './MatchInnings';
import { Match } from './Match';
import { Team } from './Team';

@Entity('ball_by_ball')
@Index("idx_ball_innings_over", ["innings_id", "over_number", "bowler_id", "ball_number", "tenant_id"])
export class BallByBall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: string;

  @Column()
  innings_id: number;

  // @Column()
  // batting_team_id: number;

  // @Column()
  // bowling_team_id: number;

  @Column({ nullable: true })
  over_number: number;

  @Column({ nullable: true })
  ball_number: number;

  @Column()
  ball_type: string; // RUN, FOUR, SIX, DOT, WICKET, WIDE, NO_BALL, BYE, LEG_BYE

  @Column({ default: 0 })
  runs: number;

  @Column({ nullable: true })
  batsman_id: number;

  @Column({ nullable: true })
  bowler_id: number;

  @Column({ default: false })
  is_wicket: boolean;

  @Column({ default: false })
  is_boundary: boolean;

  @Column({ nullable: true })
  wicket_type: string;

  @Column()
  tenant_id: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => MatchInnings)
  @JoinColumn({ name: 'innings_id' })
  innings: MatchInnings;

  // @ManyToOne(() => Team)
  // @JoinColumn({ name: 'batting_team_id' })
  // battingTeam: Team;

  // @ManyToOne(() => Team)
  // @JoinColumn({ name: 'bowling_team_id' })
  // bowlingTeam: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}