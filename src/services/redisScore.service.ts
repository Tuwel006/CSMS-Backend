import redis from "../config/redis.config";
import { LiveScorePayload } from "../types/score.type";

export class redisService {
    private static SCORE_KEY = ({matchId, inningsId}: {matchId: string, inningsId: number}) => `match:${matchId}:innings:${inningsId}:score`;
    static async setScore({matchId, inningsId, payload}: {matchId: string, inningsId: number, payload: LiveScorePayload}): Promise<void> {
        await redis.set(
            this.SCORE_KEY({matchId, inningsId}),
            JSON.stringify(payload)
        );
    }

    static async getScore({matchId, inningsId}: {matchId: string, inningsId: number}): Promise<LiveScorePayload | null> {
        const data = await redis.get(this.SCORE_KEY({matchId, inningsId}));
        if (!data) return null;
        return JSON.parse(data) as LiveScorePayload;
    }
}