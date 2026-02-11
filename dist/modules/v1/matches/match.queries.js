"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveScoreQuery = void 0;
const db_1 = require("../../../config/db");
const BallByBall_1 = require("../shared/entities/BallByBall");
const InningsBatting_1 = require("../shared/entities/InningsBatting");
const InningsBowling_1 = require("../shared/entities/InningsBowling");
const MatchInnings_1 = require("../shared/entities/MatchInnings");
class LiveScoreQuery {
    static async build(matchId, inningsId) {
        const inningsRepo = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepo = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const bowlingRepo = db_1.AppDataSource.getRepository(InningsBowling_1.InningsBowling);
        const ballRepo = db_1.AppDataSource.getRepository(BallByBall_1.BallByBall);
        // 1. Fetch innings with team relations
        const inning = await inningsRepo.findOne({
            where: { id: inningsId, match_id: matchId },
            relations: ['battingTeam', 'bowlingTeam']
        });
        if (!inning) {
            throw { status: 404, message: "Innings not found" };
        }
        // 2. Fetch all related data in parallel
        const [batsmen, bowlers, balls] = await Promise.all([
            battingRepo.find({
                where: { innings_id: inningsId },
                relations: ['player', 'bowler', 'fielder']
            }),
            bowlingRepo.find({
                where: { innings_id: inningsId },
                relations: ['player']
            }),
            ballRepo.find({
                where: { innings_id: inningsId },
                order: { over_number: 'ASC', ball_number: 'ASC' }
            })
        ]);
        // 3. Find striker and non-striker
        const striker = batsmen.find(b => b.player_id === inning.striker_id && !b.is_out);
        const nonStriker = batsmen.find(b => b.player_id === inning.non_striker_id && !b.is_out);
        // 4. Get dismissed batsmen
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
        // 5. Get current over balls
        const currentOverBalls = balls.filter(b => b.over_number === inning.current_over);
        let illegalBallsCount = 0;
        for (const b of currentOverBalls) {
            if (b.ball_type === 'WIDE' || b.ball_type === 'NO_BALL') {
                illegalBallsCount++;
            }
        }
        const isOverComplete = inning.balls % 6 === 0 && inning.balls > 0;
        // 6. Return full detailed structure
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
                striker: striker ? {
                    id: striker.player.id,
                    n: striker.player.full_name,
                    r: striker.runs,
                    b: striker.balls,
                    '4s': striker.fours,
                    '6s': striker.sixes,
                    sr: String(striker.strike_rate)
                } : null,
                nonStriker: nonStriker ? {
                    id: nonStriker.player.id,
                    n: nonStriker.player.full_name,
                    r: nonStriker.runs,
                    b: nonStriker.balls,
                    '4s': nonStriker.fours,
                    '6s': nonStriker.sixes,
                    sr: String(nonStriker.strike_rate)
                } : null
            },
            dismissed,
            bowling: bowlers.map(b => ({
                id: b.player.id,
                n: b.player.full_name,
                b: b.balls,
                r: b.runs,
                w: b.wickets,
                e: String(b.economy)
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
    }
}
exports.LiveScoreQuery = LiveScoreQuery;
