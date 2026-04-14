import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tournaments')
export class Tournament {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  startDate: string;

  @Column({ nullable: true })
  endDate: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  format: string;

  @Column({ default: 8 })
  maxTeams: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  teams: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
