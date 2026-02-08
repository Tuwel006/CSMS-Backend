import { AppDataSource } from "../../../config/db";
import { LiveBatsman } from "../../../types/score.type";
import { BallByBall } from "../shared/entities/BallByBall";
import { InningsBatting } from "../shared/entities/InningsBatting";
import { MatchInnings } from "../shared/entities/MatchInnings";

export class LiveScoreQuery {
    // need to be fixed after adding cuurent bowler id, striker id, non striker id and current innings id so that depended of current innings
    static async build(matchId: string, inningsId: number): Promise<import("../../../types/score.type").LiveScorePayload> {
        // Use one-to-one relation for striker/non-striker, fetch by inningsId
        const inningsRepo = AppDataSource.getRepository(MatchInnings);
        const battingRepo = AppDataSource.getRepository(InningsBatting);
        const ballRepo = AppDataSource.getRepository(BallByBall);

        // 1. Get innings by id (with striker_id, non_striker_id)
        const innings = await inningsRepo.createQueryBuilder("inn")
            .where("inn.id = :inningsId AND inn.match_id = :matchId", { inningsId, matchId })
            .select(["inn.id", "inn.runs", "inn.wickets", "inn.balls", "inn.current_over", "inn.striker_id", "inn.non_striker_id", "inn.is_completed"])
            .getOne();
        if (!innings) throw { status: 404, message: "Innings not found" };

        // 2. Get striker and non-striker batsmen by their ids (one-to-one, join player)
        // Filter out null/undefined IDs
        const batsmanIds = [innings.striker_id, innings.non_striker_id].filter(id => id != null);

        let striker = null;
        let nonStriker = null;

        if (batsmanIds.length > 0) {
            const batsmen = await battingRepo.createQueryBuilder("bat")
                .leftJoinAndSelect("bat.player", "player")
                .where("bat.id IN (:...ids)", { ids: batsmanIds })
                .getMany();

            striker = batsmen.find(b => b.id == innings.striker_id);
            nonStriker = batsmen.find(b => b.id == innings.non_striker_id);
        }

        // 3. Get current over balls (minimal fields)
        const currentOverBalls = await ballRepo.createQueryBuilder("ball")
            .where("ball.innings_id = :iid AND ball.over_number = :over", { iid: innings.id, over: innings.current_over })
            .select(["ball.ball_type", "ball.runs", "ball.is_wicket"])
            .orderBy("ball.ball_number", "ASC")
            .getMany();

        // 4. Map batsman to LiveBatsman
        const mapBatsman = (b: any) => b && b.player ? ({
            id: b.player.id,
            n: b.player.full_name,
            r: b.runs,
            b: b.balls,
            4: b.fours,
            6: b.sixes
        }) : null;

        // 5. Map balls to OverBall type (object)
        const mapBall = (ball: any) => {
            let type = "";
            if (ball.is_wicket) type = "W";
            else if (["WIDE", "Wd"].includes(ball.ball_type)) type = "Wd";
            else if (["NO_BALL", "Nb"].includes(ball.ball_type)) type = "Nb";
            else type = String(ball.runs);
            return { type, r: ball.runs };
        };

        return {
            i: innings.id,
            ic: innings.is_completed,
            r: innings.runs,
            w: innings.wickets,
            b: innings.balls,
            st: mapBatsman(striker) as LiveBatsman,
            ns: mapBatsman(nonStriker) as LiveBatsman,
            ov: currentOverBalls.map(mapBall)
        };
    }
}