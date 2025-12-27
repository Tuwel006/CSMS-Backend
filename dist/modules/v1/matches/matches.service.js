"use strict";
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
    static async generateMatchToken(tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const uniqueId = Math.floor(100000 + Math.random() * 900000);
        const matchToken = `CSMSMATCH${uniqueId}`;
        const match = matchRepository.create({
            id: matchToken,
            tenant_id,
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
            // Update match with toss and batting info
            match.toss_winner_team_id = startData.toss_winner_team_id;
            match.batting_first_team_id = startData.batting_first_team_id;
            match.format = startData.over.toString();
            match.status = 'LIVE';
            await matchRepository.save(match);
            // Initialize first innings
            const firstInnings = inningsRepository.create({
                match_id: matchId,
                innings_number: 1,
                batting_team_id: startData.batting_first_team_id,
                bowling_team_id: startData.batting_first_team_id === match.team_a_id ? match.team_b_id : match.team_a_id,
                tenant_id
            });
            await inningsRepository.save(firstInnings);
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
    static async getMatchScore(id, tenant_id) {
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepository = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const bowlingRepository = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        const ballRepository = db_1.AppDataSource.getRepository(BallByBall_1.BallByBall);
        const [match, innings] = await Promise.all([
            matchRepository.findOne({
                where: { id, tenant_id },
                relations: ['teamA', 'teamB']
            }),
            inningsRepository.find({
                where: { match_id: id, tenant_id },
                relations: ['battingTeam', 'bowlingTeam'],
                order: { innings_number: 'ASC' }
            })
        ]);
        if (!match) {
            throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
        }
        const inningsWithDetails = await Promise.all(innings.map(async (inning) => {
            const [batting, bowling, currentOverBalls, currentBowler] = await Promise.all([
                battingRepository.find({
                    where: { innings_id: inning.id, tenant_id },
                    relations: ['player', 'bowler', 'fielder'],
                    order: { createdAt: 'ASC' }
                }),
                bowlingRepository.find({
                    where: { innings_id: inning.id, tenant_id },
                    relations: ['player']
                }),
                ballRepository.find({
                    where: {
                        innings_id: inning.id,
                        over_number: Math.floor(Number(inning.overs)) + 1,
                        tenant_id
                    },
                    order: { ball_number: 'ASC' }
                }),
                bowlingRepository.findOne({
                    where: { innings_id: inning.id, tenant_id, is_current_bowler: true },
                    relations: ['player']
                })
            ]);
            return {
                i: inning.innings_number,
                battingTeam: inning.battingTeam?.short_name,
                bowlingTeam: inning.bowlingTeam?.short_name,
                score: {
                    r: inning.runs,
                    w: inning.wickets,
                    o: inning.overs.toString()
                },
                batting: batting.filter((b) => !b.is_out).reduce((acc, b) => {
                    const battingOrder = batting.findIndex((bat) => bat.id === b.id) + 1;
                    const player = {
                        id: b.player.id,
                        n: b.player.full_name,
                        r: b.runs,
                        b: b.balls,
                        '4s': b.fours || 0,
                        '6s': b.sixes || 0,
                        sr: b.strike_rate,
                        order: battingOrder
                    };
                    if (b.is_striker)
                        acc.striker = player;
                    else
                        acc.nonStriker = player;
                    return acc;
                }, { striker: null, nonStriker: null }),
                dismissed: batting.filter((b) => b.is_out).map((b, index) => ({
                    id: b.player.id,
                    n: b.player.full_name,
                    r: b.runs,
                    b: b.balls,
                    w: {
                        wicket_type: b.wicket_type,
                        by: b.fielder?.full_name,
                        bowler: b.bowler?.full_name
                    },
                    o: b.dismissal_over?.toString(),
                    order: batting.findIndex((bat) => bat.id === b.id) + 1
                })),
                bowling: bowling.map((b) => ({
                    id: b.player.id,
                    n: b.player.full_name,
                    o: b.overs.toString(),
                    r: b.runs,
                    w: b.wickets,
                    eco: b.economy,
                    extras: currentBowler?.player.id === b.player.id ?
                        currentOverBalls.filter((ball) => ['WIDE', 'NO_BALL'].includes(ball.ball_type)).length : 0
                })),
                currentOver: {
                    o: Math.floor(Number(inning.overs)) + 1,
                    bowlerId: currentBowler?.player.id || null,
                    balls: currentOverBalls.map((ball) => ({
                        b: ball.ball_number,
                        t: ball.ball_type,
                        r: ball.is_wicket ? 'W' : ball.runs
                    }))
                }
            };
        }));
        return {
            success: true,
            data: {
                meta: {
                    matchId: match.id,
                    format: match.format,
                    status: match.status,
                    lastUpdated: match.updatedAt
                },
                commentary: {
                    initial: "Match will start soon. Players are warming up.",
                    latest: "Live commentary will appear here."
                },
                teams: {
                    A: {
                        id: match.teamA?.id,
                        name: match.teamA?.name,
                        short: match.teamA?.short_name
                    },
                    B: {
                        id: match.teamB?.id,
                        name: match.teamB?.name,
                        short: match.teamB?.short_name
                    }
                },
                innings: inningsWithDetails
            }
        };
    }
    static async updateInningsScore(matchId, inningsData, tenant_id) {
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        let innings = await inningsRepository.findOne({
            where: {
                match_id: matchId,
                innings_number: inningsData.innings_number,
                tenant_id
            }
        });
        if (!innings) {
            innings = inningsRepository.create({
                match_id: matchId,
                innings_number: inningsData.innings_number,
                batting_team_id: inningsData.batting_team_id,
                bowling_team_id: inningsData.bowling_team_id,
                tenant_id
            });
        }
        innings.runs = inningsData.runs || innings.runs;
        innings.wickets = inningsData.wickets || innings.wickets;
        innings.overs = inningsData.overs || innings.overs;
        innings.balls = inningsData.balls || innings.balls;
        innings.extras = inningsData.extras || innings.extras;
        innings.is_completed = inningsData.is_completed || innings.is_completed;
        return await inningsRepository.save(innings);
    }
    static async recordBall(matchId, ballData, tenant_id) {
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const matchRepository = queryRunner.manager.getRepository(Match_1.Match);
            const inningsRepository = queryRunner.manager.getRepository(MatchInnings_1.MatchInnings);
            const battingRepository = queryRunner.manager.getRepository(InningsBatting_1.InningsBatting);
            const bowlingRepository = queryRunner.manager.getRepository(InningsBowling_1.InningsBowling);
            const ballRepository = queryRunner.manager.getRepository(BallByBall_1.BallByBall);
            const { ball_type, runs = 0, batsman_id, bowler_id, is_wicket = false, wicket_type, is_boundary = false, extras_enabled = false, fielder_id } = ballData;
            // Get match and current innings
            const match = await matchRepository.findOne({ where: { id: matchId, tenant_id } });
            if (!match)
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'Match not found' };
            const currentInnings = await inningsRepository.findOne({
                where: { match_id: matchId, tenant_id, is_completed: false },
                order: { innings_number: 'DESC' }
            });
            if (!currentInnings)
                throw { status: status_codes_1.HTTP_STATUS.NOT_FOUND, message: 'No active innings found' };
            const isLegalBall = !['WIDE', 'NO_BALL'].includes(ball_type);
            const isBatsmanRuns = !['WIDE', 'NO_BALL', 'BYE', 'LEG_BYE'].includes(ball_type);
            const isExtra = ['WIDE', 'NO_BALL'].includes(ball_type) && extras_enabled;
            const extraRuns = isExtra ? 1 : 0;
            // Update innings score
            currentInnings.runs += runs + extraRuns;
            if (isExtra)
                currentInnings.extras = (currentInnings.extras || 0) + extraRuns;
            if (is_wicket)
                currentInnings.wickets += 1;
            if (isLegalBall) {
                currentInnings.balls += 1;
                currentInnings.overs = Math.floor(currentInnings.balls / 6) + (currentInnings.balls % 6) / 10;
            }
            await inningsRepository.save(currentInnings);
            // Update batsman stats
            const batsman = await battingRepository.findOne({
                where: { innings_id: currentInnings.id, player_id: batsman_id, tenant_id }
            });
            if (batsman) {
                if (isBatsmanRuns)
                    batsman.runs += runs;
                if (isLegalBall)
                    batsman.balls += 1;
                if (is_boundary && (runs === 4 || runs === 6)) {
                    if (runs === 4)
                        batsman.fours = (batsman.fours || 0) + 1;
                    if (runs === 6)
                        batsman.sixes = (batsman.sixes || 0) + 1;
                }
                batsman.strike_rate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;
                if (is_wicket) {
                    batsman.is_out = true;
                    batsman.wicket_type = wicket_type;
                    batsman.dismissal_over = currentInnings.overs;
                    batsman.bowler_id = bowler_id;
                    if (['Caught', 'Run Out', 'Stumped'].includes(wicket_type) && fielder_id) {
                        batsman.fielder_id = fielder_id;
                    }
                }
                await battingRepository.save(batsman);
            }
            // Update bowler stats
            const bowler = await bowlingRepository.findOne({
                where: { innings_id: currentInnings.id, player_id: bowler_id, tenant_id }
            });
            if (bowler) {
                bowler.runs += runs + extraRuns;
                if (is_wicket)
                    bowler.wickets += 1;
                if (isLegalBall) {
                    const ballsBowled = Math.floor(bowler.overs) * 6 + ((bowler.overs % 1) * 10) + 1;
                    bowler.overs = Math.floor(ballsBowled / 6) + (ballsBowled % 6) / 10;
                }
                bowler.economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 0;
                await bowlingRepository.save(bowler);
            }
            // Handle striker rotation for odd runs (but not on over completion)
            if ((runs % 2 === 1) && !(isLegalBall && currentInnings.balls % 6 === 0)) {
                await this.flipStriker(currentInnings.id, tenant_id, queryRunner);
            }
            // Handle over completion: flip striker and reset current bowler
            if (isLegalBall && currentInnings.balls % 6 === 0) {
                await this.flipStriker(currentInnings.id, tenant_id, queryRunner);
                await bowlingRepository.update({ innings_id: currentInnings.id, tenant_id }, { is_current_bowler: false });
            }
            // Create ball record
            const over_number = Math.floor((currentInnings.balls - 1) / 6) + 1;
            const ball_number = ((currentInnings.balls - 1) % 6) + 1;
            const ball = ballRepository.create({
                match_id: matchId,
                innings_id: currentInnings.id,
                batting_team_id: currentInnings.batting_team_id,
                bowling_team_id: currentInnings.bowling_team_id,
                over_number,
                ball_number,
                ball_type,
                runs,
                batsman_id,
                bowler_id,
                is_boundary,
                is_wicket,
                wicket_type,
                tenant_id
            });
            await ballRepository.save(ball);
            await queryRunner.commitTransaction();
            return { success: true, message: 'Ball recorded successfully' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    static async flipStriker(innings_id, tenant_id, queryRunner) {
        const battingRepository = queryRunner.manager.getRepository(InningsBatting_1.InningsBatting);
        const batsmen = await battingRepository.find({
            where: { innings_id, tenant_id, is_out: false }
        });
        batsmen.forEach((batsman) => {
            batsman.is_striker = !batsman.is_striker;
        });
        await battingRepository.save(batsmen);
    }
    static async getAvailableBatsmen(matchId, inningsNumber, tenant_id) {
        const matchPlayerRepository = db_1.AppDataSource.getRepository(MatchPlayer_1.MatchPlayer);
        const battingRepository = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const innings = await inningsRepository.findOne({
            where: { match_id: matchId, innings_number: inningsNumber, tenant_id }
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
                where: { innings_id: innings.id, tenant_id },
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
    static async getBowlingTeamPlayers(matchId, inningsNumber, tenant_id) {
        const matchPlayerRepository = db_1.AppDataSource.getRepository(MatchPlayer_1.MatchPlayer);
        const inningsRepository = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const innings = await inningsRepository.findOne({
            where: { match_id: matchId, innings_number: inningsNumber, tenant_id }
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
        const battingRepository = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const { innings_id, player_id, is_striker, ret_hurt } = batsmanData;
        // If setting ret_hurt, update existing batsman
        if (ret_hurt) {
            const existingBatsman = await battingRepository.findOne({
                where: { innings_id, player_id, tenant_id }
            });
            if (existingBatsman) {
                existingBatsman.ret_hurt = true;
                existingBatsman.is_striker = false;
                await battingRepository.save(existingBatsman);
                return { success: true, message: 'Batsman marked as retired hurt' };
            }
        }
        // Check current batsmen (not out and not retired hurt)
        const currentBatsmen = await battingRepository.find({
            where: { innings_id, tenant_id, is_out: false, ret_hurt: false }
        });
        // Only allow adding if less than 2 current batsmen
        if (currentBatsmen.length >= 2) {
            throw { status: 400, message: 'Cannot add batsman. Two batsmen are already at the crease.' };
        }
        // Determine striker status automatically
        let newBatsmanIsStriker = is_striker || false;
        if (currentBatsmen.length === 1) {
            // If one batsman exists and is striker, new batsman becomes non-striker
            // If one batsman exists and is non-striker, new batsman becomes striker
            const existingBatsman = currentBatsmen[0];
            newBatsmanIsStriker = !existingBatsman.is_striker;
        }
        // Add new batsman
        const batsman = battingRepository.create({
            innings_id,
            player_id,
            is_striker: newBatsmanIsStriker,
            ret_hurt: false,
            tenant_id
        });
        await battingRepository.save(batsman);
        return { success: true, message: 'Batsman set successfully' };
    }
    static async setBowler(matchId, bowlerData, tenant_id) {
        const bowlingRepository = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        const { innings_id, player_id } = bowlerData;
        // Set all bowlers as inactive first
        await bowlingRepository.update({ innings_id, tenant_id }, { is_current_bowler: false });
        // Check if bowler already exists
        let bowler = await bowlingRepository.findOne({
            where: { innings_id, player_id, tenant_id }
        });
        if (!bowler) {
            // Create new bowler entry
            bowler = bowlingRepository.create({
                innings_id,
                player_id,
                tenant_id
            });
        }
        bowler.is_current_bowler = true;
        await bowlingRepository.save(bowler);
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
