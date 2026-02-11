import { Request, Response } from "express";
import { redisService } from "../services/redisScore.service";
import { sseManager } from "./sse.manager";
import { AppDataSource } from "../config/db";
import { Match } from "../modules/v1/shared/entities/Match";

export async function scoreSSEHandler(req: Request, res: Response) {
    const { matchId } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Fix CORS for SSE with credentials
    const origin = req.headers.origin || 'http://localhost:5173';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.flushHeaders();

    const snapshot = await redisService.getScore(matchId);
    if (snapshot) {
        const payload = `event: score\ndata: ${JSON.stringify(snapshot)}\n\n`;
        res.write(payload);
    }

    sseManager.addClient(matchId, res);

    req.on('close', () => {
        sseManager.removeClient(matchId, res);
    });
}