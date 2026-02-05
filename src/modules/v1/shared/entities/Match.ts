import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Team } from './Team';
import { Tenant } from './Tenant';
import { MatchInnings } from './MatchInnings';
import { User } from './User';

export enum MatchFormat {
  T20 = 'T20',
  ODI = 'ODI',
  TEST = 'TEST',
}

@Entity('matches')
@Index("idx_match_current_innings", ["id", "tenant_id", "current_innings_id"])
export class Match {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  team_a_id: number;

  @Column({ nullable: true })
  team_b_id: number;

  @Column({ type: 'timestamp', nullable: true })
  match_date: Date;

  @Column({ nullable: true })
  format: string;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  status: string;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  tenant_id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  toss_winner_team_id: number;

  @Column({ nullable: true })
  batting_first_team_id: number;

  @Column({ nullable: true })
  winner_team_id: number;

  @Column({ nullable: true })
  man_of_the_match_player_id: number;

  @Column({ nullable: true })
  result_description: string;

  @Column({ nullable: true })
  umpire_1: string;

  @Column({ nullable: true })
  umpire_2: string;

  @Column({ nullable: true })
  current_innings_id: number;

  @OneToOne(() => MatchInnings)
  @JoinColumn({ name: 'current_innings_id' })
  currentInnings: MatchInnings;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_a_id' })
  teamA: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'winner_team_id' })
  winner: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'toss_winner_team_id' })
  tossWinner: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'batting_first_team_id' })
  battingFirst: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_b_id' })
  teamB: Team;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => MatchInnings, innings => innings.match)
  innings: MatchInnings[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}