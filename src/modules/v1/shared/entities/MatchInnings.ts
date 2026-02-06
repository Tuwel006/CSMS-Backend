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
import { Match } from './Match';
import { Team } from './Team';

@Entity('match_innings')
@Index("idx_match_innings_id_tenant", ["id", "tenant_id"])
@Index("idx_match_innings_match", ["match_id", "tenant_id"])
export class MatchInnings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: string;

  @Column()
  innings_number: number;

  @Column()
  batting_team_id: number;

  @Column()
  bowling_team_id: number;

  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  wickets: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0.0 })
  overs: number;

  @Column({ default: 0 })
  balls: number;

  @Column({ default: 1 })
  current_over: number;

  @Column({ default: 0 })
  extras: number;

  @Column({ default: false })
  is_completed: boolean;

  @Column({ type: 'int', nullable: true })
  striker_id: number | null;

  @Column({ type: 'int', nullable: true })
  non_striker_id: number | null;

  @Column({ type: 'int', nullable: true })
  current_bowler_id: number | null;

  @Column({ type: 'int', nullable: true })
  previous_bowler_id: number | null;

  @Column()
  tenant_id: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'batting_team_id' })
  battingTeam: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'bowling_team_id' })
  bowlingTeam: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}