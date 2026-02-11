import redis from "../config/redis.config";
import { LiveScorePayload } from "../types/score.type";

export class redisService {
    private static SCORE_KEY = (matchId: string) => `match:${matchId}:score`;

    static async setScore({ matchId, payload }: { matchId: string, payload: LiveScorePayload }): Promise<void> {
        await redis.set(
            this.SCORE_KEY(matchId),
            JSON.stringify(payload)
        );
    }

    static async getScore(matchId: string): Promise<LiveScorePayload | null> {
        const data = await redis.get(this.SCORE_KEY(matchId));
        if (!data) return null;
        return JSON.parse(data) as LiveScorePayload;
    }
}