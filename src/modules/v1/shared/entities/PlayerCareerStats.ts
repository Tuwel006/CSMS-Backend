import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Player } from './Player';


@Entity('player_career_stats')
@Index(['player_id', 'format'], { unique: true })
export class PlayerCareerStats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    player_id: number;

    @Column()
    format: string;

    // Batting career stats
    @Column({ default: 0 })
    total_matches: number;

    @Column({ default: 0 })
    total_innings: number;

    @Column({ default: 0 })
    total_runs: number;

    @Column({ default: 0 })
    total_balls_faced: number;

    @Column({ default: 0 })
    centuries: number; // 100+ runs

    @Column({ default: 0 })
    half_centuries: number; // 50-99 runs

    @Column({ default: 0 })
    highest_score: number;

    @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
    batting_average: number;

    @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
    strike_rate: number;

    @Column({ default: 0 })
    times_out: number; // For calculating average

    // Bowling career stats
    @Column({ default: 0 })
    total_wickets: number;

    @Column('decimal', { precision: 6, scale: 1, default: 0.0 })
    total_overs: number;

    @Column({ default: 0 })
    total_runs_conceded: number;

    @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
    bowling_average: number;

    @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
    economy_rate: number;

    @Column({ default: 0 })
    five_wicket_hauls: number; // 5+ wickets in an innings

    @Column({ default: 0 })
    best_bowling_wickets: number;

    @Column({ default: 0 })
    best_bowling_runs: number;

    // Fielding career stats
    @Column({ default: 0 })
    total_catches: number;

    @Column({ default: 0 })
    total_run_outs: number;

    @Column({ default: 0 })
    total_stumpings: number;

    @ManyToOne(() => Player)
    @JoinColumn({ name: 'player_id' })
    player: Player;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
