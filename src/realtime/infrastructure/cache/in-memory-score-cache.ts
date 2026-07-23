/**
 * In-memory IScoreCache.
 *
 * Used in standalone mode (single-node dev) and as a safety net when Redis
 * is unavailable. Stores the latest payload per match in a Map.
 */

import { IScoreCache } from '../../domain/ports/score-cache.port';
import { LiveScorePayload } from '../../domain/entities/live-score.entity';

export class InMemoryScoreCache implements IScoreCache {
  private readonly store = new Map<string, LiveScorePayload>();

  async get(matchId: string): Promise<LiveScorePayload | null> {
    return this.store.get(matchId) ?? null;
  }

  async set(matchId: string, payload: LiveScorePayload): Promise<void> {
    this.store.set(matchId, payload);
  }

  async invalidate(matchId: string): Promise<void> {
    this.store.delete(matchId);
  }
}
