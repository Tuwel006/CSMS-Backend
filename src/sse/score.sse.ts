import { Request, Response } from "express";
import { redisService } from "../services/redisScore.service";
import { sseManager } from "./sse.manager";

export async function scoreSSEHandler(req: Request, res: Response) {
    const {matchId, inningsId} = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const snapshot = await redisService.getScore({matchId, inningsId: parseInt(inningsId)});

    if (snapshot) {
        const payload = `event: score\ndata: ${JSON.stringify(snapshot)}\n\n`;
        res.write(payload);
    }

    sseManager.addClient(matchId, res);

    req.on('close', () => {
        sseManager.removeClient(matchId, res);
    });
}