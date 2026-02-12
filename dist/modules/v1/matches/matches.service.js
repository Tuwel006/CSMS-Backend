"use strict";
/**
 * Returns a fast, minimal LiveScorePayload for SSE
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const db_1 = require("../../../config/db");
const Match_1 = require("../shared/entities/Match");
const Team_1 = require("../shared/entities/Team");
const MatchPlayer_1 = require("../shared/entities/MatchPlayer");
const MatchInnings_1 = require("../shared/entities/MatchInnings");
const InningsBatting_1 = require("../shared/entities/InningsBatting");
const InningsBowling_1 = require("../shared/entities/InningsBowling");
const BallByBall_1 = require("../shared/entities/BallByBall");
const team_service_1 = require("../teams/team.service");
const status_codes_1 = require("../../../constants/status-codes");
const typeorm_1 = require("typeorm");
const liveScore_orchestrator_1 = require("../../../orchestration/liveScore.orchestrator");
class MatchesService {
    static async resolveTeam(teamData, tenant_id) {
        const teamRepository = db_1.AppDataSource.getRepository(Team_1.Team);
        // Check if team exists by name
        const existingTeam = await teamRepository.findOne({
            where: { name: teamData.name, tenant_id }
        });
        if (existingTeam) {
            return existingTeam.id;
        }
        // Create new team if not exists
        const newTeam = await team_service_1.TeamService.createTeam({
            ...teamData,
            tenant_id
        });
        return newTeam.id;
    }
    static async generateMatchToken(tenant_id, user_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        const matchToken = `CSMSMATCH${uniqueId}`;
        const match = matchRepository.create({
            id: matchToken,
            tenant_id,
            user_id,
            is_active: true
        });
        // Insert ID only (other fields are nullable)
        return await matchRepository.save(match);
    }
    static async createMatch(data, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const teamAId = await this.resolveTeam(data.teamA, tenant_id);
        const teamBId = await this.resolveTeam(data.teamB, tenant_id);
        const match = matchRepository.create({
            team_a_id: teamAId,
            team_b_id: teamBId,
            match_date: data.match_date,
            format: data.format,
            venue: data.venue,
            status: data.status,
            tenant_id,
            is_active: true,
            id: `CSMSMATCH${Math.floor(100000 + Math.random() * 900000)}` // Generate ID if creating fully
        });
        return await matchRepository.save(match);
    }
    static async getMatches(tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        return await matchRepository.find({
            where: { tenant_id },
            relations: ['teamA', 'teamB']
        });
    }
    static async getMatchesByTenant(tenant_id, query) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const { page = 1, limit = 10, status, sorted = 'createdAt', sorted_order = 'DESC' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { tenant_id };
        if (status) {
            where.status = status;
        }
        const [matches, total] = await matchRepository.findAndCount({
            where,
            relations: ['teamA', 'teamB', 'winner', 'tossWinner', 'battingFirst', 'currentInnings', 'user'],
            order: { [sorted]: sorted_order.toUpperCase() },
            skip,
            take: Number(limit)
        });
        const totalPages = Math.ceil(total / Number(limit));
        return {
            data: matches,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPreviousPage: Number(page) > 1
            }
        };
    }
    static async getTenantMatches(tenant_id, page = 1, limit = 10, status) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const skip = (page - 1) * limit;
        const where = { tenant_id, team_a_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()), team_b_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) };
        if (status)
            where.status = status;
        const [matches, total] = await matchRepository.findAndCount({
            where,
            relations: ['teamA', 'teamB', 'user'],
            order: { match_date: 'DESC', createdAt: 'DESC' },
            skip,
            take: limit
        });
        const matchesWithInnings = await Promise.all(matches.map(async (match) => {
            const innings = await inningsRepository.find({
                where: { match_id: match.id, tenant_id },
                relations: ['battingTeam', 'bowlingTeam'],
                order: { innings_number: 'ASC' }
            });
            return {
                meta: {
                    matchId: match.id,
                    format: match.format,
                    status: match.status,
                    currentInningsId: match.current_innings_id,
                    lastUpdated: match.updatedAt
                },
                teams: {
                    A: {
                        id: match.teamA.id,
                        name: match.teamA.name,
                        short: match.teamA.short_name
                    },
                    B: {
                        id: match.teamB.id,
                        name: match.teamB.name,
                        short: match.teamB.short_name
                    }
                },
                innings: innings.map(inning => ({
                    i: inning.innings_number,
                    battingTeam: inning.battingTeam.short_name,
                    bowlingTeam: inning.bowlingTeam.short_name,
                    score: {
                        r: inning.runs,
                        w: inning.wickets,
                        b: inning.balls
                    }
                }))
            };
        }));
        const totalPages = Math.ceil(total / limit);
        return {
            data: matchesWithInnings,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }
    static async getAllMatches(page = 1, limit = 10, sortBy = 'createdAt') {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const skip = (page - 1) * limit;
        const orderField = sortBy === 'match_date' ? 'match_date' : 'createdAt';
        const [matches, total] = await matchRepository.findAndCount({
            where: { team_a_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()), team_b_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
            relations: ['teamA', 'teamB'],
            order: { [orderField]: 'DESC' },
            skip,
            take: limit
        });
        const matchesWithInnings = await Promise.all(matches.map(async (match) => {
            const innings = await inningsRepository.find({
                where: { match_id: match.id, tenant_id: match.tenant_id },
                relations: ['battingTeam', 'bowlingTeam'],
                order: { innings_number: 'ASC' }
            });
            return {
                meta: {
                    matchId: match.id,
                    format: match.format,
                    status: match.status,
                    currentInningsId: match.current_innings_id,
                    lastUpdated: match.updatedAt,
                    tenantId: match.tenant_id
                },
                teams: {
                    A: {
                        id: match.teamA.id,
                        name: match.teamA.name,
                        short: match.teamA.short_name
                    },
                    B: {
                        id: match.teamB.id,
                        name: match.teamB.name,
                        short: match.teamB.short_name
                    }
                },
                innings: innings.map(inning => ({
                    i: inning.innings_number,
                    battingTeam: inning.battingTeam.short_name,
                    bowlingTeam: inning.bowlingTeam.short_name,
                    score: {
                        r: inning.runs,
                        w: inning.wickets,
                        b: inning.balls
                    }
                }))
            };
        }));
        const totalPages = Math.ceil(total / limit);
        return {
            data: matchesWithInnings,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }
    static async getMatchById(id, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id, tenant_id },
            relations: ['teamA', 'teamB']
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        return match;
    }
    static async updateMatch(id, data, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await this.getMatchById(id, tenant_id);
        Object.assign(match, data);
        return await matchRepository.save(match);
    }
    static async deleteMatch(id, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await this.getMatchById(id, tenant_id);
        await matchRepository.remove(match);
        return { message: 'Match deleted successfully' };
    }
    static async deleteMatchToken(id, tenant_id) {
        return await this.deleteMatch(id, tenant_id);
    }
    static async getCurrentCreatedMatch(id, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const matchPlayerRepository = db_1.AppDataSource.getRepository(MatchPlayer_1.MatchPlayer);
        const match = await matchRepository.findOne({
            where: { id, tenant_id },
            relations: ['teamA', 'teamB']
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        const teamAPlayers = await matchPlayerRepository.find({
            where: { match_id: id, team_id: match.team_a_id },
            relations: ['player']
        });
        const teamBPlayers = await matchPlayerRepository.find({
            where: { match_id: id, team_id: match.team_b_id },
            relations: ['player']
        });
        const allPlayers = [...teamAPlayers, ...teamBPlayers];
        const manOfTheMatchPlayer = match.man_of_the_match_player_id
            ? allPlayers.find(mp => mp.player.id === match.man_of_the_match_player_id)
            : null;
        return {
            id: match.id,
            match_date: match.match_date,
            format: match.format,
            venue: match.venue,
            status: match.status,
            current_innings_id: match.current_innings_id,
            umpire_1: match.umpire_1,
            umpire_2: match.umpire_2,
            ...(match.toss_winner_team_id && { toss_winner_team_id: match.toss_winner_team_id }),
            ...(match.batting_first_team_id && { batting_first_team_id: match.batting_first_team_id }),
            teamA: match.teamA ? {
                id: match.teamA.id,
                name: match.teamA.name,
                short_name: match.teamA.short_name,
                is_toss_winner: match.toss_winner_team_id === match.team_a_id,
                players: teamAPlayers.map((mp) => ({
                    id: mp.player.id,
                    name: mp.player.full_name,
                    role: mp.role
                }))
            } : null,
            teamB: match.teamB ? {
                id: match.teamB.id,
                name: match.teamB.name,
                short_name: match.teamB.short_name,
                is_toss_winner: match.toss_winner_team_id === match.team_b_id,
                players: teamBPlayers.map((mp) => ({
                    id: mp.player.id,
                    name: mp.player.full_name,
                    role: mp.role
                }))
            } : null
        };
    }
    static async scheduleMatch(matchId, scheduleData, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        match.venue = scheduleData.venue;
        match.match_date = scheduleData.match_date;
        match.format = scheduleData.format;
        match.umpire_1 = scheduleData.umpire_1;
        match.umpire_2 = scheduleData.umpire_2;
        match.status = 'SCHEDULED';
        return await matchRepository.save(match);
    }
    static async startMatch(matchId, startData, tenant_id) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchRepository = queryRunner.manager.getRepository(Match_1.Match);
            const matchPlayerRepository = queryRunner.manager.getRepository(MatchPlayer_1.MatchPlayer);
            const inningsRepository = queryRunner.manager.getRepository(MatchInnings_1.MatchInnings);
            const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
            if (!match) {
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
            }
            // Initialize and save first innings (to get ID)
            const firstInnings = inningsRepository.create({
                match_id: matchId,
                innings_number: 1,
                batting_team_id: startData.batting_first_team_id,
                bowling_team_id: startData.batting_first_team_id === match.team_a_id ? match.team_b_id : match.team_a_id,
                tenant_id
            });
            await inningsRepository.save(firstInnings);
            // Update match with toss, batting info AND current innings ID (single update)
            match.toss_winner_team_id = startData.toss_winner_team_id;
            match.batting_first_team_id = startData.batting_first_team_id;
            match.format = startData.over.toString();
            match.status = 'LIVE';
            match.current_innings_id = firstInnings.id;
            match.playing_count = startData.teamA.playing_11_id.length || startData.teamB.playing_11_id.length || 11;
            await matchRepository.save(match);
            // Update playing 11 for both teams
            const allPlayingIds = [...startData.teamA.playing_11_id, ...startData.teamB.playing_11_id];
            await matchPlayerRepository
                .createQueryBuilder()
                .update(MatchPlayer_1.MatchPlayer)
                .set({ is_playing11: true })
                .where('match_id = :matchId AND player_id IN (:...playerIds)', {
                matchId,
                playerIds: allPlayingIds
            })
                .execute();
            // Update captain roles
            const captainIds = [startData.teamA.captain_id, startData.teamB.captain_id];
            for (const captainId of captainIds) {
                const captainPlayer = await matchPlayerRepository.findOne({
                    where: { match_id: matchId, player_id: captainId }
                });
                if (captainPlayer) {
                    const currentRole = captainPlayer.role || '';
                    captainPlayer.role = currentRole ? `${currentRole}|Captain` : 'Captain';
                    await matchPlayerRepository.save(captainPlayer);
                }
            }
            await queryRunner.commitTransaction();
            return match;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getMatchScore(matchId, tenant_id) {
        const matchRepo = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepo = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepo = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const bowlingRepo = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        const ballRepo = db_1.AppDataSource.getRepository(BallByBall_1.BallByBall);
        /* 1️⃣ Get match + innings (PARALLEL) */
        const [match, inningsList] = await Promise.all([
            matchRepo.findOne({
                where: { id: matchId, tenant_id },
                relations: ['teamA', 'teamB']
            }),
            inningsRepo.find({
                where: { match_id: matchId, tenant_id },
                relations: ['battingTeam', 'bowlingTeam'],
                order: { innings_number: 'ASC' }
            })
        ]);
        if (!match) {
            throw { status: 404, message: 'Match not found' };
        }
        /* 2️⃣ Build innings response */
        const inningsData = await Promise.all(inningsList.map(async (inning) => {
            /* 🔹 Fetch only what is needed */
            const [batsmen, bowlers, currentBowler, currentOverBalls] = await Promise.all([
                battingRepo.find({
                    where: { innings_id: inning.id, tenant_id },
                    relations: ['player', 'bowler', 'fielder']
                }),
                bowlingRepo.find({
                    where: { innings_id: inning.id, tenant_id },
                    relations: ['player']
                }),
                bowlingRepo.findOne({
                    where: {
                        innings_id: inning.id,
                        tenant_id,
                        is_current_bowler: true
                    },
                    relations: ['player']
                }),
                ballRepo.find({
                    where: {
                        innings_id: inning.id,
                        over_number: inning.current_over,
                        tenant_id
                    },
                    order: { ball_number: 'ASC' }
                })
            ]);
            /* 3️⃣ Striker & non-striker */
            const striker = batsmen.find(b => b.is_striker && !b.is_out);
            const nonStriker = batsmen.find(b => !b.is_striker && !b.is_out);
            /* 4️⃣ Dismissed batsmen */
            const dismissed = batsmen
                .filter(b => b.is_out)
                .map((b) => ({
                id: b.player.id,
                n: b.player.full_name,
                r: b.runs,
                b: b.balls,
                w: {
                    type: b.wicket_type,
                    bowler: b.bowler?.full_name || null,
                    fielder: b.fielder?.full_name || null
                },
                o: b.dismissal_over
            }));
            /* 5️⃣ isOverComplete (NO DB QUERY) */
            const isOverComplete = inning.balls % 6 === 0 && inning.balls > 0;
            return {
                i: inning.innings_number,
                battingTeam: inning.battingTeam.short_name,
                bowlingTeam: inning.bowlingTeam.short_name,
                score: {
                    r: inning.runs,
                    w: inning.wickets,
                    b: inning.balls
                },
                batting: {
                    striker: striker && {
                        id: striker.player.id,
                        n: striker.player.full_name,
                        r: striker.runs,
                        b: striker.balls,
                        '4s': striker.fours,
                        '6s': striker.sixes,
                        sr: striker.strike_rate
                    },
                    nonStriker: nonStriker && {
                        id: nonStriker.player.id,
                        n: nonStriker.player.full_name,
                        r: nonStriker.runs,
                        b: nonStriker.balls,
                        '4s': nonStriker.fours,
                        '6s': nonStriker.sixes,
                        sr: nonStriker.strike_rate
                    }
                },
                dismissed,
                bowling: bowlers.map(b => ({
                    id: b.player.id,
                    n: b.player.full_name,
                    b: b.balls,
                    r: b.runs,
                    w: b.wickets,
                    e: b.economy
                })),
                currentOver: {
                    o: inning.current_over,
                    isOverComplete,
                    bowlerId: inning.current_bowler_id,
                    ballsCount: currentOverBalls.length,
                    illegalBallsCount: currentOverBalls.filter(ball => ['WIDE', 'NO_BALL'].includes(ball.ball_type)).length,
                    balls: currentOverBalls.map(ball => ({
                        b: ball.ball_number,
                        t: ball.ball_type,
                        r: ball.is_wicket ? 'W' : ball.runs
                    }))
                }
            };
        }));
        /* 6️⃣ Final response */
        return {
            success: true,
            data: {
                meta: {
                    matchId: match.id,
                    format: match.format,
                    status: match.status,
                    currentInningsId: match.current_innings_id,
                    lastUpdated: match.updatedAt
                },
                teams: {
                    A: {
                        id: match.teamA.id,
                        name: match.teamA.name,
                        short: match.teamA.short_name
                    },
                    B: {
                        id: match.teamB.id,
                        name: match.teamB.name,
                        short: match.teamB.short_name
                    }
                },
                innings: inningsData
            }
        };
    }
    static async getPublicMatchScore(matchId, tenant_id) {
        const matchRepo = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepo = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepo = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const bowlingRepo = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        const ballRepo = db_1.AppDataSource.getRepository(BallByBall_1.BallByBall);
        /* 1️⃣ Fetch match + innings (PARALLEL) */
        const [match, inningsList] = await Promise.all([
            matchRepo.findOne({
                where: { id: matchId, tenant_id },
                relations: ['teamA', 'teamB']
            }),
            inningsRepo.find({
                where: { match_id: matchId, tenant_id },
                relations: ['battingTeam', 'bowlingTeam'],
                order: { innings_number: 'ASC' }
            })
        ]);
        if (!match) {
            throw { status: 404, message: 'Match not found' };
        }
        if (!inningsList.length) {
            return {
                success: true,
                data: {
                    meta: {
                        matchId: match.id,
                        format: match.format,
                        status: match.status,
                        currentInningsId: match.current_innings_id,
                        lastUpdated: match.updatedAt
                    },
                    teams: {
                        A: {
                            id: match.teamA.id,
                            name: match.teamA.name,
                            short: match.teamA.short_name
                        },
                        B: {
                            id: match.teamB.id,
                            name: match.teamB.name,
                            short: match.teamB.short_name
                        }
                    },
                    innings: []
                }
            };
        }
        const inningsIds = inningsList.map(i => i.id);
        /* 2️⃣ Fetch ALL related data ONCE (PARALLEL) */
        const [allBatsmen, allBowlers, allBalls] = await Promise.all([
            battingRepo.find({
                where: { innings_id: (0, typeorm_1.In)(inningsIds), tenant_id },
                relations: ['player', 'bowler', 'fielder']
            }),
            bowlingRepo.find({
                where: { innings_id: (0, typeorm_1.In)(inningsIds), tenant_id },
                relations: ['player']
            }),
            ballRepo.find({
                where: { innings_id: (0, typeorm_1.In)(inningsIds), tenant_id },
                order: { over_number: 'ASC', ball_number: 'ASC' }
            })
        ]);
        /* 3️⃣ Group in memory (FAST) */
        const batsmenByInnings = new Map();
        const bowlersByInnings = new Map();
        const ballsByInnings = new Map();
        for (const b of allBatsmen) {
            if (!batsmenByInnings.has(b.innings_id)) {
                batsmenByInnings.set(b.innings_id, []);
            }
            batsmenByInnings.get(b.innings_id).push(b);
        }
        for (const b of allBowlers) {
            if (!bowlersByInnings.has(b.innings_id)) {
                bowlersByInnings.set(b.innings_id, []);
            }
            bowlersByInnings.get(b.innings_id).push(b);
        }
        for (const b of allBalls) {
            if (!ballsByInnings.has(b.innings_id)) {
                ballsByInnings.set(b.innings_id, []);
            }
            ballsByInnings.get(b.innings_id).push(b);
        }
        /* 4️⃣ Build innings response (NO DB CALLS INSIDE LOOP) */
        const inningsData = inningsList.map((inning) => {
            const batsmen = batsmenByInnings.get(inning.id) || [];
            const bowlers = bowlersByInnings.get(inning.id) || [];
            const balls = ballsByInnings.get(inning.id) || [];
            const striker = batsmen.find(b => b.player_id === inning.striker_id && !b.is_out);
            const nonStriker = batsmen.find(b => b.player_id === inning.non_striker_id && !b.is_out);
            const dismissed = batsmen
                .filter(b => b.is_out)
                .map(b => ({
                id: b.player.id,
                n: b.player.full_name,
                r: b.runs,
                b: b.balls,
                w: {
                    type: b.wicket_type,
                    bowler: b.bowler?.full_name || null,
                    fielder: b.fielder?.full_name || null
                },
                o: b.dismissal_over
            }));
            const currentOverBalls = balls.filter(b => b.over_number === inning.current_over);
            let illegalBallsCount = 0;
            for (const b of currentOverBalls) {
                if (b.ball_type === 'WIDE' || b.ball_type === 'NO_BALL') {
                    illegalBallsCount++;
                }
            }
            const isOverComplete = inning.balls % 6 === 0 && inning.balls > 0;
            return {
                i: inning.id,
                is_completed: inning.is_completed,
                innings_number: inning.innings_number,
                battingTeam: inning.battingTeam.short_name,
                bowlingTeam: inning.bowlingTeam.short_name,
                score: {
                    r: inning.runs,
                    w: inning.wickets,
                    b: inning.balls
                },
                batting: {
                    striker: striker && {
                        id: striker.player.id,
                        n: striker.player.full_name,
                        r: striker.runs,
                        b: striker.balls,
                        '4s': striker.fours,
                        '6s': striker.sixes,
                        sr: striker.strike_rate
                    },
                    nonStriker: nonStriker && {
                        id: nonStriker.player.id,
                        n: nonStriker.player.full_name,
                        r: nonStriker.runs,
                        b: nonStriker.balls,
                        '4s': nonStriker.fours,
                        '6s': nonStriker.sixes,
                        sr: nonStriker.strike_rate
                    }
                },
                dismissed,
                bowling: bowlers.map(b => ({
                    id: b.player.id,
                    n: b.player.full_name,
                    b: b.balls,
                    r: b.runs,
                    w: b.wickets,
                    e: b.economy
                })),
                currentOver: {
                    o: inning.current_over,
                    isOverComplete,
                    bowlerId: inning.current_bowler_id,
                    ballsCount: currentOverBalls.length,
                    illegalBallsCount,
                    balls: currentOverBalls.map(ball => ({
                        b: ball.ball_number,
                        t: ball.ball_type,
                        r: ball.is_wicket ? 'W' : ball.runs
                    }))
                }
            };
        });
        /* 5️⃣ Final response (UNCHANGED STRUCTURE) */
        return {
            success: true,
            data: {
                meta: {
                    matchId: match.id,
                    format: match.format,
                    status: match.status,
                    currentInningsId: match.current_innings_id,
                    lastUpdated: match.updatedAt
                },
                teams: {
                    A: {
                        id: match.teamA.id,
                        name: match.teamA.name,
                        short: match.teamA.short_name
                    },
                    B: {
                        id: match.teamB.id,
                        name: match.teamB.name,
                        short: match.teamB.short_name
                    }
                },
                innings: inningsData
            }
        };
    }
    static async recordBall(matchId, ballData, tenant_id) {
        const apiStart = Date.now();
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        console.log("Connect time:", Date.now() - apiStart);
        await queryRunner.startTransaction();
        console.log("Transaction started:", Date.now() - apiStart);
        try {
            const inningsRepository = queryRunner.manager.getRepository(MatchInnings_1.MatchInnings);
            const battingRepository = queryRunner.manager.getRepository(InningsBatting_1.InningsBatting);
            const bowlingRepository = queryRunner.manager.getRepository(InningsBowling_1.InningsBowling);
            // const ballRepository = queryRunner.manager.getRepository(BallByBall);
            const matchRepo = queryRunner.manager.getRepository(Match_1.Match);
            const { ball_type, runs = 0, is_wicket = false, is_boundary = false, by_runs = 0, wicket } = ballData;
            const match = await matchRepo.findOne({
                where: { id: matchId, tenant_id },
                select: ["id", "current_innings_id", "playing_count", "format", "no_of_innings"]
            });
            if (match?.current_innings_id === null || match?.current_innings_id === undefined) {
                throw new Error("No active innings");
            }
            const innings_id = match.current_innings_id;
            if (!innings_id) {
                throw new Error('innings_id is required');
            }
            // Cricket logic calculations
            const isLegalBall = !['WIDE', 'NO_BALL'].includes(ball_type);
            const isExtra = ['WIDE', 'NO_BALL'].includes(ball_type);
            const extraRuns = isExtra ? 1 : 0;
            const runsBetweenWickets = runs > 0 ? runs : by_runs;
            const runsToAdd = runsBetweenWickets + extraRuns;
            const ballsToAdd = isLegalBall ? 1 : 0;
            // Fetch innings with pessimistic lock
            const innings = await inningsRepository.findOne({
                where: { id: innings_id, tenant_id },
                lock: { mode: 'pessimistic_write' }
            });
            if (!innings)
                throw new Error('Innings not found');
            const strikerId = innings.striker_id;
            const nonStrikerId = innings.non_striker_id;
            const bowlerId = innings.current_bowler_id;
            if (!strikerId || !nonStrikerId || !bowlerId) {
                throw new Error('Striker, Non-Striker or Bowler not set for the innings');
            }
            if (innings.previous_bowler_id === bowlerId) {
                throw new Error('Same bowler cannot bowl consecutive overs');
            }
            // Calculate final values (innings becomes stale after updates)
            const totalRuns = innings.runs + runsToAdd;
            const totalWickets = innings.wickets + (is_wicket ? 1 : 0);
            const totalBalls = innings.balls + ballsToAdd;
            const totalExtras = innings.extras + by_runs + extraRuns;
            const nextBallCount = innings.balls + ballsToAdd;
            const isOverComplete = nextBallCount % 6 === 0 && isLegalBall;
            const overNumber = innings.current_over + (isOverComplete ? 1 : 0);
            // Ball number logic: legal balls increment, extras don't
            const ballNumber = isLegalBall
                ? (innings.balls % 6) + 1
                : (innings.balls % 6) || 6;
            // Strike rotation: odd runs OR end of over (legal ball only)
            const shouldFlipStrike = runsBetweenWickets % 2 === 1 || (isOverComplete && isLegalBall);
            // 2. Update batsman (atomic SQL)
            await battingRepository.update({ innings_id, player_id: strikerId, tenant_id }, {
                runs: () => `runs + ${runs}`,
                balls: () => `balls + ${ballsToAdd}`,
                ...(is_boundary && runs === 4 && { fours: () => 'fours + 1' }),
                ...(is_boundary && runs === 6 && { sixes: () => 'sixes + 1' }),
                ...(is_wicket && wicket?.out_batsman_id === strikerId && {
                    is_out: true,
                    ...(wicket?.wicket_type && { wicket_type: wicket.wicket_type }),
                    ...(wicket?.bowler_id && { bowler_id: wicket.bowler_id }),
                    ...(wicket?.fielder_id && { fielder_id: wicket.fielder_id })
                })
            });
            if (is_wicket && wicket && wicket?.out_batsman_id !== strikerId) {
                await battingRepository.update({ innings_id, player_id: nonStrikerId, tenant_id }, {
                    is_out: true,
                    ...(wicket?.wicket_type && { wicket_type: wicket.wicket_type }),
                    ...(wicket?.bowler_id && { bowler_id: wicket.bowler_id }),
                    ...(wicket?.fielder_id && { fielder_id: wicket.fielder_id })
                });
            }
            // 3. Update bowler (atomic SQL)
            await bowlingRepository.update({ innings_id, player_id: bowlerId, tenant_id }, {
                runs: () => `runs + ${runsToAdd}`,
                ...(is_wicket && { wickets: () => 'wickets + 1' }),
                ...(isLegalBall && { balls: () => 'balls + 1' })
            });
            // 5. Handle over completion
            if (isOverComplete) {
                await bowlingRepository.update({ innings_id, tenant_id }, { is_current_bowler: false });
            }
            // 6. Create ball record
            const insertResult = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(BallByBall_1.BallByBall)
                .values({
                match_id: matchId,
                innings_id: innings.id,
                over_number: innings.current_over,
                ball_number: ballNumber,
                ball_type,
                runs,
                batsman_id: strikerId,
                bowler_id: bowlerId,
                is_boundary,
                is_wicket,
                wicket_type: wicket?.wicket_type,
                tenant_id
            })
                .returning("*") // 🔥 this is the key
                .execute();
            const insertedBall = insertResult.raw[0];
            // Fetch current over balls for response
            // const currentOverBalls = await ballRepository.find({
            //     where: {
            //         innings_id: innings.id,
            //         over_number: innings.current_over,
            //         bowler_id: bowlerId,
            //         tenant_id
            //     },
            //     order: { ball_number: 'ASC' }
            // });
            let innings_over = false;
            if (totalWickets === (match.playing_count || 11) - 1) {
                innings_over = true;
            }
            if (totalBalls === Number(match.format) * 6) {
                innings_over = true;
            }
            // 1. Update innings (atomic SQL)
            await inningsRepository.update({ id: innings_id, tenant_id }, {
                runs: () => `runs + ${runsToAdd}`,
                wickets: () => `wickets + ${is_wicket ? 1 : 0}`,
                balls: () => `balls + ${ballsToAdd}`,
                extras: () => `extras + ${by_runs + extraRuns}`,
                ...(isOverComplete && {
                    current_over: () => 'current_over + 1',
                    previous_bowler_id: bowlerId,
                    current_bowler_id: null
                }),
                ...(shouldFlipStrike && { striker_id: nonStrikerId, non_striker_id: strikerId }),
                ...(is_wicket && wicket?.out_batsman_id === strikerId && { striker_id: null }),
                ...(is_wicket && wicket?.out_batsman_id === nonStrikerId && { non_striker_id: null }),
                ...(innings_over && {
                    is_completed: true,
                })
            });
            if (innings_over) {
                await matchRepo.update({ id: match.id, tenant_id }, {
                    current_innings_id: null
                });
                if (match.no_of_innings === innings.innings_number) {
                    await matchRepo.update({ id: match.id, tenant_id }, {
                        is_completed: true,
                        winner_team_id: innings.bowling_team_id,
                        status: 'COMPLETED'
                    });
                }
            }
            // const illegalBallsCount = currentOverBalls.filter(ball =>
            //     ['WIDE', 'NO_BALL'].includes(ball.ball_type)
            // ).length;
            await queryRunner.commitTransaction();
            // fire sse
            setImmediate(() => {
                liveScore_orchestrator_1.LiveScoreService
                    .scoreEventService(matchId, innings_id)
                    .catch(err => {
                    console.error("LiveScore SSE error:", err);
                });
            });
            console.log("Total API time:", Date.now() - apiStart);
            // Return UI-friendly response with computed final values
            return {
                innings: innings_id,
                is_innings_over: innings_over,
                totalRuns,
                totalWickets,
                totalBalls,
                totalExtras,
                runsAdded: runsToAdd,
                batsmanRuns: runs,
                bowlerRuns: runsToAdd,
                byRuns: by_runs,
                extraRuns: extraRuns,
                isLegalBall,
                isWicket: is_wicket,
                isOverComplete,
                shouldFlipStrike,
                overNumber,
                ballNumber,
                currentOver: {
                    o: isOverComplete ? innings.current_over + 1 : innings.current_over,
                    isOverComplete,
                    bowlerId,
                    // ballsCount: insertedBall.ball_number,
                    isInLegalBall: isLegalBall ? false : true,
                    ball: {
                        b: insertedBall.ball_number,
                        t: insertedBall.ball_type,
                        r: insertedBall.is_wicket ? 'W' : insertedBall.runs
                    }
                },
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async getAvailableBatsmen(matchId, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id: matchId, tenant_id }
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        const matchPlayerRepository = db_1.AppDataSource.getRepository(MatchPlayer_1.MatchPlayer);
        const battingRepository = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        if (!match.current_innings_id) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
        }
        const innings = await inningsRepository.findOne({
            where: { id: match.current_innings_id }
        });
        if (!innings) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
        }
        const [battingTeamPlayers, currentBatsmen] = await Promise.all([
            matchPlayerRepository.find({
                where: { match_id: matchId, team_id: innings.batting_team_id, is_playing11: true },
                relations: ['player']
            }),
            battingRepository.find({
                where: { innings_id: innings.id },
                relations: ['player']
            })
        ]);
        const batsmenInInnings = new Set(currentBatsmen.map((b) => b.player_id));
        const availableBatsmen = battingTeamPlayers.filter((mp) => !batsmenInInnings.has(mp.player_id));
        return {
            success: true,
            data: availableBatsmen.map((mp) => ({
                id: mp.player_id,
                name: mp.player.full_name,
                role: mp.role
            }))
        };
    }
    static async getBowlingTeamPlayers(matchId, tenant_id) {
        const matchPlayerRepository = db_1.AppDataSource.getRepository(MatchPlayer_1.MatchPlayer);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id: matchId, tenant_id }
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        if (!match.current_innings_id) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
        }
        const innings = await inningsRepository.findOne({
            where: { match_id: matchId, id: match.current_innings_id, tenant_id }
        });
        if (!innings) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
        }
        const bowlingTeamPlayers = await matchPlayerRepository.find({
            where: { match_id: matchId, team_id: innings.bowling_team_id, is_playing11: true },
            relations: ['player']
        });
        return {
            success: true,
            data: bowlingTeamPlayers.map((mp) => ({
                id: mp.player_id,
                name: mp.player.full_name,
                role: mp.role
            }))
        };
    }
    static async setBatsman(matchId, batsmanData, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepository = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const match = await matchRepository.findOne({
            where: { id: matchId, tenant_id }
        });
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        const { player_id, is_striker = true, ret_hurt } = batsmanData;
        if (!match.current_innings_id || match.current_innings_id === null) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
        }
        // If setting ret_hurt, update existing batsman
        if (ret_hurt) {
            const existingBatsman = await battingRepository.findOne({
                where: { innings_id: match.current_innings_id, player_id, tenant_id }
            });
            if (existingBatsman) {
                existingBatsman.ret_hurt = true;
                existingBatsman.is_striker = false;
                await battingRepository.save(existingBatsman);
                return { success: true, message: 'Batsman marked as retired hurt' };
            }
        }
        // Check current batsmen (not out and not retired hurt)
        // const currentBatsmen = await battingRepository.find({
        //     where: { innings_id: match.current_innings_id, tenant_id, is_out: false, ret_hurt: false }
        // });
        const innings = await inningsRepository.findOne({
            where: { id: match.current_innings_id, tenant_id }
        });
        if (!innings) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
        }
        if (innings.striker_id && innings.non_striker_id) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Two batsmen are already at the crease.' };
        }
        // Add new batsman
        const batsman = battingRepository.create({
            innings_id: match.current_innings_id,
            player_id,
            is_striker: innings.striker_id ? false : true,
            ret_hurt: false,
            tenant_id
        });
        await battingRepository.save(batsman);
        await inningsRepository.update({ id: match.current_innings_id, tenant_id }, innings.striker_id ? { non_striker_id: batsman.player_id } : { striker_id: batsman.player_id });
        setImmediate(() => {
            liveScore_orchestrator_1.LiveScoreService
                .scoreEventService(matchId, match.current_innings_id)
                .catch(err => {
                console.error("LiveScore SSE error:", err);
            });
        });
        return { success: true, message: 'Batsman set successfully' };
    }
    static async setBowler(matchId, bowlerData, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const match = await matchRepository.findOne({
            where: { id: matchId, tenant_id }
        });
        const bowlingRepository = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        const { player_id } = bowlerData;
        if (!match.current_innings_id) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
        }
        // update match innings current bowler
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const innings = await inningsRepository.findOne({
            where: { id: match.current_innings_id, tenant_id }
        });
        if (!innings) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Innings not found' };
        }
        if (innings.previous_bowler_id === player_id) {
            throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'Same bowler cannot bowl consecutive overs' };
        }
        // Set all bowlers as inactive first
        await bowlingRepository.update({ innings_id: match.current_innings_id, tenant_id }, { is_current_bowler: false });
        await inningsRepository.update({ id: match.current_innings_id, tenant_id }, {
            current_bowler_id: player_id,
            ...(innings.current_bowler_id && { previous_bowler_id: innings.current_bowler_id })
        });
        // Check if bowler already exists
        let bowler = await bowlingRepository.findOne({
            where: { innings_id: match.current_innings_id, player_id, tenant_id }
        });
        if (!bowler) {
            if (!match.current_innings_id) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: 'No active innings for this match' };
            }
            // Create new bowler entry
            bowler = bowlingRepository.create({
                innings_id: match.current_innings_id,
                player_id,
                tenant_id
            }); // needs to fix
        }
        bowler.is_current_bowler = true;
        await bowlingRepository.save(bowler);
        setImmediate(() => {
            liveScore_orchestrator_1.LiveScoreService
                .scoreEventService(matchId, match.current_innings_id)
                .catch(err => {
                console.error("LiveScore SSE error:", err);
            });
        });
        return { success: true, message: 'Bowler set successfully' };
    }
    static async completeMatch(matchId, tenant_id) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchRepository = queryRunner.manager.getRepository(Match_1.Match);
            const ballRepository = queryRunner.manager.getRepository(BallByBall_1.BallByBall);
            const { BallHistory } = await Promise.resolve().then(() => __importStar(require('../shared/entities/BallHistory')));
            const ballHistoryRepository = queryRunner.manager.getRepository(BallHistory);
            const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
            if (!match) {
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
            }
            // Archive ball-by-ball data
            const ballData = await ballRepository.find({
                where: { match_id: matchId, tenant_id },
                relations: ['innings']
            });
            if (ballData.length > 0) {
                const historyData = ballData.map((ball) => ({
                    match_id: ball.match_id,
                    innings_number: ball.innings?.innings_number || 1,
                    batting_team_id: ball.batting_team_id,
                    bowling_team_id: ball.bowling_team_id,
                    over_number: ball.over_number,
                    ball_number: ball.ball_number,
                    ball_type: ball.ball_type,
                    runs: ball.runs,
                    batsman_id: ball.batsman_id,
                    bowler_id: ball.bowler_id,
                    is_wicket: ball.is_wicket,
                    wicket_type: ball.wicket_type,
                    tenant_id: ball.tenant_id
                }));
                await ballHistoryRepository.save(historyData);
                // Delete from live table
                await ballRepository.delete({ match_id: matchId, tenant_id });
            }
            // Update match status
            match.status = 'COMPLETED';
            await matchRepository.save(match);
            await queryRunner.commitTransaction();
            return { success: true, message: 'Match completed and data archived successfully' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.MatchesService = MatchesService;
