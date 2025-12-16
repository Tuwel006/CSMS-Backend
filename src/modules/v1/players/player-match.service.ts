import { AppDataSource } from '../../../config/db';
import { MatchPlayer } from '../shared/entities/MatchPlayer';
import { PlayerStats } from '../shared/entities/PlayerStats';
import { MatchFormat } from '../shared/entities/Match';
import { Between, In } from 'typeorm';

export class PlayerMatchService {
    private matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
    private playerStatsRepo = AppDataSource.getRepository(PlayerStats);

    /**
     * Get all matches for a specific player
     */
    async getPlayerMatches(playerId: number, options?: {
        format?: MatchFormat;
        isPlaying11?: boolean;
        teamId?: number;
        limit?: number;
    }) {
        const where: any = { player_id: playerId };

        if (options?.isPlaying11 !== undefined) {
            where.is_playing11 = options.isPlaying11;
        }

        if (options?.teamId) {
            where.team_id = options.teamId;
        }

        let query = this.matchPlayerRepo
            .createQueryBuilder('mp')
            .leftJoinAndSelect('mp.match', 'match')
            .leftJoinAndSelect('mp.team', 'team')
            .leftJoinAndSelect('mp.player', 'player')
            .where('mp.player_id = :playerId', { playerId });

        if (options?.format) {
            query = query.andWhere('match.format = :format', { format: options.format });
        }

        if (options?.isPlaying11 !== undefined) {
            query = query.andWhere('mp.is_playing11 = :isPlaying11', {
                isPlaying11: options.isPlaying11
            });
        }

        if (options?.teamId) {
            query = query.andWhere('mp.team_id = :teamId', { teamId: options.teamId });
        }

        query = query.orderBy('match.match_date', 'DESC');

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        return await query.getMany();
    }

    /**
     * Get player match summary statistics
     */
    async getPlayerMatchSummary(playerId: number) {
        const allMatches = await this.matchPlayerRepo.find({
            where: { player_id: playerId },
            relations: ['match']
        });

        const playing11Matches = allMatches.filter(mp => mp.is_playing11);
        const substituteMatches = allMatches.filter(mp => !mp.is_playing11);

        return {
            player_id: playerId,
            total_matches: allMatches.length,
            playing_11_matches: playing11Matches.length,
            substitute_appearances: substituteMatches.length,
            by_format: {
                T20: allMatches.filter(mp => mp.match.format === MatchFormat.T20).length,
                ODI: allMatches.filter(mp => mp.match.format === MatchFormat.ODI).length,
                TEST: allMatches.filter(mp => mp.match.format === MatchFormat.TEST).length,
            },
            by_status: {
                SCHEDULED: allMatches.filter(mp => mp.match.status === 'SCHEDULED').length,
                ONGOING: allMatches.filter(mp => mp.match.status === 'ONGOING').length,
                COMPLETED: allMatches.filter(mp => mp.match.status === 'COMPLETED').length,
                CANCELLED: allMatches.filter(mp => mp.match.status === 'CANCELLED').length,
            }
        };
    }

    /**
     * Get player's recent matches with performance stats
     */
    async getPlayerRecentMatchesWithStats(playerId: number, limit: number = 10) {
        const matches = await this.matchPlayerRepo
            .createQueryBuilder('mp')
            .leftJoinAndSelect('mp.match', 'match')
            .leftJoinAndSelect('mp.team', 'team')
            .where('mp.player_id = :playerId', { playerId })
            .orderBy('match.match_date', 'DESC')
            .limit(limit)
            .getMany();

        // Get stats for these matches
        const matchIds = matches.map(mp => mp.match_id);
        const stats = await this.playerStatsRepo.find({
            where: {
                player_id: playerId,
                match_id: In(matchIds)
            }
        });

        // Combine matches with stats
        return matches.map(mp => {
            const matchStats = stats.find(s => s.match_id === mp.match_id);
            return {
                match_id: mp.match_id,
                match_date: mp.match.match_date,
                venue: mp.match.venue,
                format: mp.match.format,
                status: mp.match.status,
                team: {
                    id: mp.team.id,
                    name: mp.team.name,
                    short_name: mp.team.short_name
                },
                player_status: mp.is_playing11 ? 'Playing 11' : 'Substitute',
                role: mp.role,
                performance: matchStats ? {
                    runs: matchStats.runs,
                    balls_faced: matchStats.balls_faced,
                    fours: matchStats.fours,
                    sixes: matchStats.sixes,
                    wickets: matchStats.wickets,
                    overs_bowled: matchStats.overs_bowled,
                    runs_conceded: matchStats.runs_conceded,
                    catches: matchStats.catches,
                    run_outs: matchStats.run_outs,
                    stumpings: matchStats.stumpings
                } : null
            };
        });
    }

    /**
     * Get matches by date range
     */
    async getPlayerMatchesByDateRange(
        playerId: number,
        startDate: Date,
        endDate: Date
    ) {
        return await this.matchPlayerRepo
            .createQueryBuilder('mp')
            .leftJoinAndSelect('mp.match', 'match')
            .leftJoinAndSelect('mp.team', 'team')
            .where('mp.player_id = :playerId', { playerId })
            .andWhere('match.match_date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate
            })
            .orderBy('match.match_date', 'ASC')
            .getMany();
    }

    /**
     * Get matches grouped by team
     */
    async getPlayerMatchesByTeam(playerId: number) {
        const matches = await this.matchPlayerRepo.find({
            where: { player_id: playerId },
            relations: ['match', 'team'],
            order: { match: { match_date: 'DESC' } }
        });

        // Group by team
        const matchesByTeam = matches.reduce((acc, mp) => {
            const teamId = mp.team.id;
            if (!acc[teamId]) {
                acc[teamId] = {
                    team: {
                        id: mp.team.id,
                        name: mp.team.name,
                        short_name: mp.team.short_name
                    },
                    matches: []
                };
            }
            acc[teamId].matches.push({
                match_id: mp.match_id,
                match_date: mp.match.match_date,
                venue: mp.match.venue,
                format: mp.match.format,
                is_playing11: mp.is_playing11,
                role: mp.role
            });
            return acc;
        }, {} as Record<number, any>);

        return Object.values(matchesByTeam);
    }

    /**
     * Check if player played in a specific match
     */
    async isPlayerInMatch(playerId: number, matchId: string): Promise<boolean> {
        const count = await this.matchPlayerRepo.count({
            where: { player_id: playerId, match_id: matchId }
        });
        return count > 0;
    }

    /**
     * Get player's role in a specific match
     */
    async getPlayerRoleInMatch(playerId: number, matchId: string) {
        const matchPlayer = await this.matchPlayerRepo.findOne({
            where: { player_id: playerId, match_id: matchId },
            relations: ['team']
        });

        if (!matchPlayer) {
            return null;
        }

        return {
            match_id: matchId,
            player_id: playerId,
            team: {
                id: matchPlayer.team.id,
                name: matchPlayer.team.name
            },
            is_playing11: matchPlayer.is_playing11,
            role: matchPlayer.role,
            status: matchPlayer.is_playing11 ? 'Playing 11' : 'Substitute'
        };
    }

    /**
     * Get all players in a specific match
     */
    async getMatchPlayers(matchId: string, teamId?: number) {
        const where: any = { match_id: matchId };
        if (teamId) {
            where.team_id = teamId;
        }

        return await this.matchPlayerRepo.find({
            where,
            relations: ['player', 'team'],
            order: { is_playing11: 'DESC' }
        });
    }

    /**
     * Get playing 11 for a match
     */
    async getMatchPlaying11(matchId: string, teamId: number) {
        return await this.matchPlayerRepo.find({
            where: {
                match_id: matchId,
                team_id: teamId,
                is_playing11: true
            },
            relations: ['player'],
            order: { role: 'ASC' }
        });
    }

    /**
     * Get substitutes for a match
     */
    async getMatchSubstitutes(matchId: string, teamId: number) {
        return await this.matchPlayerRepo.find({
            where: {
                match_id: matchId,
                team_id: teamId,
                is_playing11: false
            },
            relations: ['player']
        });
    }
}
