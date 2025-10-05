import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Team } from './Team';
import { Player } from './Player';

@Entity('team_players')
export class TeamPlayer {
  @PrimaryColumn()
  team_id: number;

  @PrimaryColumn()
  player_id: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @CreateDateColumn()
  createdAt: Date;
}