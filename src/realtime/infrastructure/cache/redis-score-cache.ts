/**
 * Redis-backed IScoreCache.
 *
 * Stores the latest computed payload per match with a configurable TTL so
 * stale snapshots eventually fall out of the cache.
 */

import type { Redis } from 'ioredis';
import { IScoreCache } from '../../domain/ports/score-cache.port';
import { LiveScorePayload } from '../../domain/entities/live-score.entity';
import { CacheKeys } from './cache-keys';

export type RedisScoreCacheOptions = {
  ttlSeconds?: number;
};

export class RedisScoreCache implements IScoreCache {
  private readonly ttlSeconds: number;

  constructor(
    private readonly redis: Redis,
    options: RedisScoreCacheOptions = {}
  ) {
    this.ttlSeconds = options.ttlSeconds ?? 86400; // 24h default
  }

  async get(matchId: string): Promise<LiveScorePayload | null> {
    const data = await this.redis.get(CacheKeys.score(matchId));
    if (!data) return null;
    try {
      return JSON.parse(data) as LiveScorePayload;
    } catch {
      return null;
    }
  }

  async set(matchId: string, payload: LiveScorePayload): Promise<void> {
    await this.redis.set(
      CacheKeys.score(matchId),
      JSON.stringify(payload),
      'EX',
      this.ttlSeconds
    );
  }

  async invalidate(matchId: string): Promise<void> {
    await this.redis.del(CacheKeys.score(matchId));
  }
}
