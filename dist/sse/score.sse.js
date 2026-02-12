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
exports.scoreSSEHandler = scoreSSEHandler;
const redisScore_service_1 = require("../services/redisScore.service");
const sse_manager_1 = require("./sse.manager");
const db_1 = require("../config/db");
const Match_1 = require("../modules/v1/shared/entities/Match");
async function scoreSSEHandler(req, res) {
    const { matchId } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Fix CORS for SSE with credentials
    const origin = req.headers.origin || 'http://localhost:5173';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.flushHeaders();
    let snapshot = null;
    try {
        snapshot = await redisScore_service_1.redisService.getScore(matchId);
    }
    catch (err) {
        console.error('Redis fetch failed, falling back to DB:', err.message);
    }
    // Fallback to DB if Redis fails or snapshot is missing
    if (!snapshot) {
        try {
            const matchRepo = db_1.AppDataSource.getRepository(Match_1.Match);
            const match = await matchRepo.findOne({
                where: { id: matchId },
                select: ["current_innings_id"]
            });
            if (match?.current_innings_id) {
                const { LiveScoreQuery } = await Promise.resolve().then(() => __importStar(require('../modules/v1/matches/match.queries')));
                snapshot = await LiveScoreQuery.build(matchId, match.current_innings_id);
                // Store in Redis for future requests
                await redisScore_service_1.redisService.setScore({ matchId, payload: snapshot });
            }
        }
        catch (dbErr) {
            console.error('DB fallback failed:', dbErr.message);
        }
    }
    if (snapshot) {
        const payload = `event: score\ndata: ${JSON.stringify(snapshot)}\n\n`;
        res.write(payload);
    }
    sse_manager_1.sseManager.addClient(matchId, res);
    req.on('close', () => {
        sse_manager_1.sseManager.removeClient(matchId, res);
    });
}
