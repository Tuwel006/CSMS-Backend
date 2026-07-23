/**
 * LiveScoreSnapshotService — application service for fetching the latest
 * live score snapshot.
 *
 * Used by the SSE handler (on connect) and by the matches REST endpoints
 * (getMatchScore / getPublicMatchScore). Reads cache first, falls back to
 * the database, and writes the built snapshot back into the cache.
 */

import { IScoreCache } from '../../domain/ports/score-cache.port';
import { IScoreSnapshotBuilder } from '../../domain/ports/score-snapshot.port';
import { LiveScorePayload } from '../../domain/entities/live-score.entity';
import { CacheError } from '../../errors/realtime.errors';
import logger from '../../../utils/logger';

export type LiveScoreSnapshotServiceDeps = {
  cache: IScoreCache;
  snapshotBuilder: IScoreSnapshotBuilder;
};

export class LiveScoreSnapshotService {
  constructor(private readonly deps: LiveScoreSnapshotServiceDeps) {}

  /**
   * Returns the latest cached snapshot for the match, or null if there is
   * no cached value. Cache failures are logged and treated as a miss.
   */
  async getCached(matchId: string): Promise<LiveScorePayload | null> {
    try {
      return await this.deps.cache.get(matchId);
    } catch (err) {
      logger.warn('Cache read failed; treating as miss', { matchId, err });
      return null;
    }
  }

  /**
   * Returns the latest snapshot, building from the database if not cached.
   * On a cache miss it writes the built snapshot back into the cache.
   */
  async getOrBuild(matchId: string, inningsId: number): Promise<LiveScorePayload | null> {
    const cached = await this.getCached(matchId);
    if (cached) return cached;

    let payload: LiveScorePayload;
    try {
      payload = await this.deps.snapshotBuilder.build(matchId, inningsId);
    } catch (err) {
      if (err && typeof err === 'object' && 'status' in err) throw err;
      throw new CacheError('CACHE_READ_FAILED', 'Failed to build snapshot from DB', err);
    }

    try {
      await this.deps.cache.set(matchId, payload);
    } catch (err) {
      logger.warn('Cache write failed after build', { matchId, err });
    }

    return payload;
  }
}
