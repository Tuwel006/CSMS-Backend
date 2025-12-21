import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ball_history')
@Index(['match_id', 'innings_number'])
@Index(['match_id', 'tenant_id'])
export class BallHistory {
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

  @Column()
  over_number: number;

  @Column()
  ball_number: number;

  @Column()
  ball_type: string;

  @Column({ default: 0 })
  runs: number;

  @Column({ nullable: true })
  batsman_id: number;

  @Column({ nullable: true })
  batsman_name: string;

  @Column({ nullable: true })
  bowler_id: number;

  @Column({ nullable: true })
  bowler_name: string;

  @Column({ default: false })
  is_wicket: boolean;

  @Column({ nullable: true })
  wicket_type: string;

  @Column({ nullable: true })
  fielder_name: string;

  @Column()
  tenant_id: number;

  @CreateDateColumn()
  createdAt: Date;
}
