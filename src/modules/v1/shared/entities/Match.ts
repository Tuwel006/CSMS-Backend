import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './Team';
import { Tenant } from './Tenant';

@Entity('matches')
export class Match {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  team_a_id: number;

  @Column({ nullable: true })
  team_b_id: number;

  @Column({ nullable: true })
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

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_a_id' })
  teamA: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_b_id' })
  teamB: Team;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}