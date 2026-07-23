/**
 * Express handler for the `/sse/score/:matchId` endpoint.
 *
 * Lifecycle:
 *   1. Apply SSE headers (Content-Type, CORS, buffering)
 *   2. Resolve the current innings for the match (from DB) — needed for the
 *      cache-miss fallback
 *   3. Look up the cached snapshot via the snapshot service; if miss, build
 *      from DB and write back to cache
 *   4. Replay the snapshot to the client (if any)
 *   5. Subscribe to the channel for live updates and write them to the client
 *   6. On transport close/error, unsubscribe and remove the client
 */

import type { Request, Response } from 'express';
import { LiveScoreSnapshotService } from '../../application/live-score/live-score.snapshot.service';
import { LiveScorePayload } from '../../domain/entities/live-score.entity';
import { SSE_EVENTS } from '../../domain/types/events.type';
import {
  IScoreChannel,
  ScoreChannelMessage,
} from '../../domain/ports/score-channel.port';
import { IClientRegistry } from '../../domain/ports/client-registry.port';
import { SSEClient } from '../../infrastructure/transport/sse/sse-client';
import { SseWriter } from '../../infrastructure/transport/sse/sse-writer';
import { AppDataSource } from '../../../config/db';
import { Match } from '../../../modules/v1/shared/entities/Match';
import { RealtimeError } from '../../errors/realtime.errors';
import { applySseHeaders } from './score-sse.headers';
import logger from '../../../utils/logger';

export type ScoreSseHandlerDeps = {
  snapshotService: LiveScoreSnapshotService;
  channel: IScoreChannel;
  registry: IClientRegistry;
  writer: SseWriter;
  realtimeMode: 'standalone' | 'distributed' | 'disabled';
  heartbeatMs: number;
  writeTimeoutMs: number;
};

export function createScoreSseHandler(deps: ScoreSseHandlerDeps) {
  return async function scoreSSEHandler(req: Request, res: Response): Promise<void> {
    if (deps.realtimeMode === 'disabled') {
      res.status(503).json({ error: 'Realtime disabled', code: 'REALTIME_DISABLED' });
      return;
    }

    const { matchId } = req.params;
    applySseHeaders(req, res);

    // 1. Resolve current innings_id (needed for cache-miss fallback)
    let inningsId: number | null = null;
    try {
      const match = await AppDataSource.getRepository(Match).findOne({
        where: { id: matchId },
        select: ['current_innings_id'],
      });
      inningsId = match?.current_innings_id ?? null;
    } catch (err) {
      logger.warn('Failed to read match for SSE', { matchId, err });
    }

    // 2. Snapshot replay (cache hit, or DB fallback)
    let snapshot: LiveScorePayload | null = null;
    if (inningsId != null) {
      snapshot = await deps.snapshotService.getOrBuild(matchId, inningsId);
    } else {
      snapshot = await deps.snapshotService.getCached(matchId);
    }

    // 3. Attach client + subscribe to channel
    const client = new SSEClient(
      res,
      deps.writer,
      deps.registry,
      matchId,
      { heartbeatMs: deps.heartbeatMs, writeTimeoutMs: deps.writeTimeoutMs }
    );
    deps.registry.add(client);

    if (snapshot) {
      client.write(SSE_EVENTS.SNAPSHOT, snapshot);
    }

    const unsubscribe = deps.channel.subscribe(matchId, (msg: ScoreChannelMessage) => {
      if (msg.event === SSE_EVENTS.SCORE) {
        client.write(SSE_EVENTS.SCORE, msg.payload as LiveScorePayload);
      }
    });

    const cleanup = () => {
      try {
        unsubscribe();
      } catch (err) {
        logger.warn('Channel unsubscribe failed', { matchId, err });
      }
      client.close();
    };

    res.on('close', cleanup);
    res.on('error', cleanup);
  };
}

// Retained for back-compat with imports that take the bare function. The
// container build wires in the actual dependencies; if a caller imports this
// without going through the container they will get a 503 (disabled mode).
export async function scoreSSEHandler(req: Request, res: Response): Promise<void> {
  const handler = createScoreSseHandler({
    snapshotService: undefined as any,
    channel: undefined as any,
    registry: undefined as any,
    writer: new SseWriter(),
    realtimeMode: 'disabled',
    heartbeatMs: 25_000,
    writeTimeoutMs: 5_000,
  });
  try {
    await handler(req, res);
  } catch (err) {
    if (err instanceof RealtimeError) {
      res.status(503).json({ error: err.message, code: err.code });
      return;
    }
    logger.error('SSE handler crashed', { err });
    res.status(500).json({ error: 'SSE handler failed', code: 'INTERNAL_ERROR' });
  }
}
