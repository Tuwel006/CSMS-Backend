"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveScoreService = void 0;
const sse_manager_1 = require("../sse/sse.manager");
const redisScore_service_1 = require("../services/redisScore.service");
const match_queries_1 = require("../modules/v1/matches/match.queries");
class LiveScoreService {
    // Implementation for live score service
    static async scoreEventService(matchId, inningsId) {
        const payload = await match_queries_1.LiveScoreQuery.build(matchId, inningsId);
        console.log("🚀 Debug - LiveScoreService - scoreEventService - payload:", payload);
        redisScore_service_1.redisService.setScore({ matchId, payload });
        sse_manager_1.sseManager.broadcast(matchId, "score", payload);
    }
}
exports.LiveScoreService = LiveScoreService;
