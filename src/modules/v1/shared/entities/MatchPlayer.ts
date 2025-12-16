import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Match } from './Match';
import { Player } from './Player';
import { Team } from './Team';

@Entity('match_players')
@Index(['match_id', 'team_id'])
export class MatchPlayer {
  @PrimaryColumn()
  match_id: string;

  @PrimaryColumn()
  player_id: number;

  @Column()
  team_id: number;

  @ManyToOne(() => Match, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => Player, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Team, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ default: false })
  is_playing11: boolean;

  @Column({ length: 50, nullable: true })
  role: string;

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
  @Column('decimal', { precision: 4, scale: 1, default: 0.0 })
  overs_bowled: number;

  @Column({ default: 0 })
  runs_conceded: number;

  @Column({ default: 0 })
  wickets: number;

  @Column({ default: 0 })
  maidens: number;

  // Fielding stats
  @Column({ default: 0 })
  catches: number;

  @Column({ default: 0 })
  run_outs: number;

  @Column({ default: 0 })
  stumpings: number;

  @CreateDateColumn()
  createdAt: Date;
}