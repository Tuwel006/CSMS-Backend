/**
 * Orchestrates the live score publishing pipeline:
 *   1. Build the payload via LiveScoreQuery
 *   2. Persist it to the Redis cache
 *   3. Broadcast it to all SSE subscribers of that match
 *
 * Used by match service methods after any state-changing action
 * (set batsman, set bowler, record ball, etc.) so SSE clients
 * see real-time updates.
 */

import { sseManager } from '../sse/score-sse.manager';
import { ScoreCache } from '../cache/score-cache';
import { LiveScoreQuery } from '../../modules/v1/features/tenant/matches/queries';

export class LiveScoreOrchestrator {
  /**
   * Recompute and publish the live score for the given match/innings.
   * Errors are logged by the caller; this method does not throw.
   */
  static async publishScore(matchId: string, inningsId: number): Promise<void> {
    const payload = await LiveScoreQuery.build(matchId, inningsId);
    await ScoreCache.set(matchId, payload);
    sseManager.broadcast(matchId, 'score', payload);
  }
}