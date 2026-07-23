/**
 * Redis-backed cache for live match score payloads.
 * Stores the latest computed payload per match so SSE clients can
 * receive the current state immediately upon connection (snapshot replay).
 */

import redis from '../../config/redis.config';
import { LiveScorePayload } from '../types/score.type';

export class ScoreCache {
  private static key = (matchId: string) => `match:${matchId}:score`;

  static async set(matchId: string, payload: LiveScorePayload): Promise<void> {
    await redis.set(this.key(matchId), JSON.stringify(payload));
  }

  static async get(matchId: string): Promise<LiveScorePayload | null> {
    const data = await redis.get(this.key(matchId));
    if (!data) return null;
    return JSON.parse(data) as LiveScorePayload;
  }
}