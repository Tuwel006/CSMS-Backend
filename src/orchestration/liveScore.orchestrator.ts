import { MatchesService } from "../modules/v1/matches/matches.service";
import { sseManager } from "../sse/sse.manager";
import { LiveScorePayload } from "../types/score.type";
import { redisService } from "../services/redisScore.service";
import { LiveScoreQuery } from "../modules/v1/matches/match.queries";

export class LiveScoreService {
    // Implementation for live score service
    static async scoreEventService(matchId: string, inningsId: number): Promise<void> {
        const payload = await LiveScoreQuery.build(matchId, inningsId);
        console.log("🚀 Debug - LiveScoreService - scoreEventService - payload:", payload);
        redisService.setScore({ matchId, inningsId, payload });
        sseManager.broadcast(matchId, "score", payload);
    }
}