import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './Tenant';
import { Team } from './Team';

export enum MatchFormat {
  TEST = 'TEST',
  ODI = 'ODI',
  T20 = 'T20',
}

@Entity('matches')
export class Matches {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MatchFormat,
  })
  format: MatchFormat;

  @Column()
  venue: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  match_date: Date;

  @Column()
  tenant_id: number;

  @ManyToMany(() => Team)
  @JoinTable({
    name: 'match_teams',
    joinColumn: { name: 'match_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' }
  })
  teams: Team[];

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
