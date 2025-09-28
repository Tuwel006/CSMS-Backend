import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string; // USD, EUR, etc.

  @Column()
  billing_cycle: string; // monthly, yearly, lifetime

  // Match limits
  @Column({ nullable: true })
  max_matches_per_month: number; // null = unlimited

  @Column({ nullable: true })
  max_matches_per_day: number; // null = unlimited

  @Column({ nullable: true })
  max_total_matches: number; // null = unlimited

  // Tournament limits
  @Column({ nullable: true })
  max_tournaments_per_month: number; // null = unlimited

  @Column({ nullable: true })
  max_tournaments_per_year: number; // null = unlimited

  // User limits
  @Column({ nullable: true })
  max_users: number; // null = unlimited

  @Column({ nullable: true })
  max_admins: number; // null = unlimited

  // Time limits
  @Column({ nullable: true })
  max_match_duration_hours: number; // null = unlimited

  @Column({ nullable: true })
  max_tournament_duration_days: number; // null = unlimited

  // Storage limits
  @Column({ nullable: true })
  max_storage_gb: number; // null = unlimited

  @Column({ nullable: true })
  max_file_size_mb: number; // null = unlimited

  // Feature flags
  @Column({ default: false })
  analytics_enabled: boolean;

  @Column({ default: false })
  custom_branding: boolean;

  @Column({ default: false })
  api_access: boolean;

  @Column({ default: false })
  priority_support: boolean;

  @Column({ default: false })
  live_streaming: boolean;

  @Column({ default: false })
  advanced_reporting: boolean;

  // Status
  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_popular: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}