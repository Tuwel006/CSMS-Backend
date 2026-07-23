/**
 * Express handler for the `/sse/score/:matchId` endpoint.
 * Streams live score events to the client. On connect, replays the latest
 * cached snapshot (Redis) so the UI shows current state immediately;
 * falls back to DB query if Redis is empty.
 */

import { Request, Response } from 'express';
import { ScoreCache } from '../cache/score-cache';
import { sseManager } from './score-sse.manager';
import { AppDataSource } from '../../config/db';
import { Match } from '../../modules/v1/shared/entities/Match';
import { LiveScorePayload } from '../types/score.type';
import { LiveScoreQuery } from '../../modules/v1/features/tenant/matches/queries';

export async function scoreSSEHandler(req: Request, res: Response) {
  const { matchId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // CORS for SSE with credentials
  const origin = req.headers.origin || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.flushHeaders();

  // Try Redis first, then DB fallback
  let snapshot: LiveScorePayload | null = null;
  try {
    snapshot = await ScoreCache.get(matchId);
  } catch (err: any) {
    console.error('Redis fetch failed, falling back to DB:', err.message);
  }

  if (!snapshot) {
    try {
      const match = await AppDataSource.getRepository(Match).findOne({
        where: { id: matchId },
        select: ['current_innings_id']
      });

      if (match?.current_innings_id) {
        const built = await LiveScoreQuery.build(matchId, match.current_innings_id);
        snapshot = built;
        await ScoreCache.set(matchId, built);
      }
    } catch (dbErr: any) {
      console.error('DB fallback failed:', dbErr.message);
    }
  }

  if (snapshot) {
    res.write(`event: score\ndata: ${JSON.stringify(snapshot)}\n\n`);
  }

  sseManager.addClient(matchId, res);

  req.on('close', () => {
    sseManager.removeClient(matchId, res);
  });
}