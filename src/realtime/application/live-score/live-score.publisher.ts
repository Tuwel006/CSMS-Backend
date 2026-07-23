/**
 * LiveScorePublisher — application service that orchestrates publishing a
 * live score update.
 *
 * Pipeline:
 *   1. Build the snapshot from the database (or read from cache) via the
 *      IScoreSnapshotBuilder.
 *   2. Persist the snapshot to the IScoreCache so new SSE clients can
 *      replay it on connect.
 *   3. Publish the snapshot to the IScoreChannel so all Node instances
 *      receive it and broadcast to their locally-connected SSE clients.
 *
 * The HTTP/SSE layer does not call this directly — it goes through the
 * composition root (realtime.container.ts) which wires the publisher with
 * the appropriate implementations.
 */

import { IScoreCache } from '../../domain/ports/score-cache.port';
import {
  IScoreChannel,
  ScoreChannelMessage,
} from '../../domain/ports/score-channel.port';
import { IScoreSnapshotBuilder } from '../../domain/ports/score-snapshot.port';
import { LiveScorePayload } from '../../domain/entities/live-score.entity';
import { SSE_EVENTS } from '../../domain/types/events.type';
import { RealtimeError } from '../../errors/realtime.errors';
import logger from '../../../utils/logger';

export type LiveScorePublisherDeps = {
  cache: IScoreCache;
  channel: IScoreChannel;
  snapshotBuilder: IScoreSnapshotBuilder;
};

export class LiveScorePublisher {
  constructor(private readonly deps: LiveScorePublisherDeps) {}

  /**
   * Recompute and broadcast the live score for the given match/innings.
   * Errors are logged and rethrown as RealtimeError so the caller can map
   * to an HTTP response.
   */
  async publishScore(matchId: string, inningsId: number): Promise<void> {
    let payload: LiveScorePayload;
    try {
      payload = await this.deps.snapshotBuilder.build(matchId, inningsId);
    } catch (err) {
      // Preserve the existing 404 contract (the controller layer maps
      // { status, message } errors). Wrap only true infrastructure failures.
      if (err && typeof err === 'object' && 'status' in err) throw err;
      throw new RealtimeError('SCORE_BUILD_FAILED', 'Failed to build score snapshot', err);
    }

    try {
      await this.deps.cache.set(matchId, payload);
    } catch (err) {
      // Cache failures should not block publish — log and continue.
      logger.warn('Cache set failed; continuing with publish', { matchId, err });
    }

    const message: ScoreChannelMessage = {
      matchId,
      event: SSE_EVENTS.SCORE,
      payload,
      publishedAt: Date.now(),
    };

    await this.deps.channel.publish(message);
  }
}
