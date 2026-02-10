"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveScoreQuery = void 0;
const db_1 = require("../../../config/db");
const BallByBall_1 = require("../shared/entities/BallByBall");
const InningsBatting_1 = require("../shared/entities/InningsBatting");
const MatchInnings_1 = require("../shared/entities/MatchInnings");
class LiveScoreQuery {
    // need to be fixed after adding cuurent bowler id, striker id, non striker id and current innings id so that depended of current innings
    static async build(matchId, inningsId) {
        // Use one-to-one relation for striker/non-striker, fetch by inningsId
        const inningsRepo = db_1.AppDataSource.getRepository(MatchInnings_1.MatchInnings);
        const battingRepo = db_1.AppDataSource.getRepository(InningsBatting_1.InningsBatting);
        const ballRepo = db_1.AppDataSource.getRepository(BallByBall_1.BallByBall);
        // 1. Get innings by id (with striker_id, non_striker_id)
        const innings = await inningsRepo.createQueryBuilder("inn")
            .where("inn.id = :inningsId AND inn.match_id = :matchId", { inningsId, matchId })
            .select(["inn.id", "inn.runs", "inn.wickets", "inn.balls", "inn.current_over", "inn.striker_id", "inn.non_striker_id", "inn.is_completed"])
            .getOne();
        if (!innings)
            throw { status: 404, message: "Innings not found" };
        // 2. Get striker and non-striker batsmen by their ids (one-to-one, join player)
        // Filter out null/undefined IDs
        const batsmanIds = [innings.striker_id, innings.non_striker_id].filter(id => id != null);
        let striker = null;
        let nonStriker = null;
        if (batsmanIds.length > 0) {
            const batsmen = await battingRepo.createQueryBuilder("bat")
                .leftJoinAndSelect("bat.player", "player")
                .where("bat.player_id IN (:...ids)", { ids: batsmanIds })
                .getMany();
            striker = batsmen.find(b => b.player_id == innings.striker_id);
            nonStriker = batsmen.find(b => b.player_id == innings.non_striker_id);
        }
        // 3. Get current over balls (minimal fields)
        const currentOverBalls = await ballRepo.createQueryBuilder("ball")
            .where("ball.innings_id = :iid AND ball.over_number = :over", { iid: innings.id, over: innings.current_over })
            .select(["ball.ball_type", "ball.runs", "ball.is_wicket"])
            .orderBy("ball.ball_number", "ASC")
            .getMany();
        // 4. Map batsman to LiveBatsman
        const mapBatsman = (b) => b && b.player ? ({
            id: b.player.id,
            n: b.player.full_name,
            r: b.runs,
            b: b.balls,
            4: b.fours,
            6: b.sixes
        }) : null;
        // 5. Map balls to OverBall type (object)
        const mapBall = (ball) => {
            let type = "";
            if (ball.is_wicket)
                type = "W";
            else if (["WIDE", "Wd"].includes(ball.ball_type))
                type = "Wd";
            else if (["NO_BALL", "Nb"].includes(ball.ball_type))
                type = "Nb";
            else
                type = String(ball.runs);
            return { type, r: ball.runs };
        };
        return {
            i: innings.id,
            ic: innings.is_completed,
            r: innings.runs,
            w: innings.wickets,
            b: innings.balls,
            st: mapBatsman(striker),
            ns: mapBatsman(nonStriker),
            ov: currentOverBalls.map(mapBall)
        };
    }
}
exports.LiveScoreQuery = LiveScoreQuery;
