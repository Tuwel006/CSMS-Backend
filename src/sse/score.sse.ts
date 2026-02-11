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

    let snapshot = null;
    try {
        snapshot = await redisService.getScore(matchId);
    } catch (err: any) {
        console.error('Redis fetch failed, falling back to DB:', err.message);
    }

    // Fallback to DB if Redis fails or snapshot is missing
    if (!snapshot) {
        try {
            const matchRepo = AppDataSource.getRepository(Match);
            const match = await matchRepo.findOne({
                where: { id: matchId },
                select: ["current_innings_id"]
            });

            if (match?.current_innings_id) {
                const { LiveScoreQuery } = await import('../modules/v1/matches/match.queries');
                snapshot = await LiveScoreQuery.build(matchId, match.current_innings_id);
            }
        } catch (dbErr: any) {
            console.error('DB fallback failed:', dbErr.message);
        }
    }

    if (snapshot) {
        const payload = `event: score\ndata: ${JSON.stringify(snapshot)}\n\n`;
        res.write(payload);
    }

    sseManager.addClient(matchId, res);

    req.on('close', () => {
        sseManager.removeClient(matchId, res);
    });
}