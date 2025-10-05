import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Matches } from './Matches';
import { Player } from './Player';
import { Team } from './Team';

@Entity('match_players')
@Index(['match_id', 'team_id'])
export class MatchPlayer {
  @PrimaryColumn()
  match_id: number;

  @PrimaryColumn()
  player_id: number;

  @Column()
  team_id: number;

  @ManyToOne(() => Matches, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'match_id' })
  match: Matches;

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

  @CreateDateColumn()
  createdAt: Date;
}