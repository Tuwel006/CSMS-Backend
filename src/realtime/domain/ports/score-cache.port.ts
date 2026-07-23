/**
 * Port: IScoreCache.
 *
 * Stores the latest computed LiveScorePayload per match so SSE clients
 * receive the current state immediately upon connection (snapshot replay).
 */

import { LiveScorePayload } from '../entities/live-score.entity';

export interface IScoreCache {
  get(matchId: string): Promise<LiveScorePayload | null>;
  set(matchId: string, payload: LiveScorePayload): Promise<void>;
  invalidate(matchId: string): Promise<void>;
}
