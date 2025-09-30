import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './Tenant';

export enum MatchFormat {
  TEST = 'TEST',
  ODI = 'ODI',
  T20 = 'T20',
}

@Entity('matches')
export class Matches {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  match_id: string;

  @Column({
    type: 'enum',
    enum: MatchFormat,
  })
  format: MatchFormat;

  @Column()
  venue: string;

  @Column()
  status: string;

  @Column()
  team1_name: string;

  @Column()
  team2_name: string;

  @Column()
  tenant_id: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
