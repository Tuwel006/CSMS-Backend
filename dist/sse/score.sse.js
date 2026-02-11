"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreSSEHandler = scoreSSEHandler;
const redisScore_service_1 = require("../services/redisScore.service");
const sse_manager_1 = require("./sse.manager");
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
    const snapshot = await redisScore_service_1.redisService.getScore(matchId);
    if (snapshot) {
        const payload = `event: score\ndata: ${JSON.stringify(snapshot)}\n\n`;
        res.write(payload);
    }
    sse_manager_1.sseManager.addClient(matchId, res);
    req.on('close', () => {
        sse_manager_1.sseManager.removeClient(matchId, res);
    });
}
