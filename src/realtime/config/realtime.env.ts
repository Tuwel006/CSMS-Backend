/**
 * Redis connection wiring for the realtime module.
 *
 * In distributed mode we need two Redis connections (one for publishing,
 * one for subscribing); in standalone mode we just need one for the cache.
 * The standalone singleton from src/config/redis.config.ts is reused to
 * preserve the existing connection lifecycle / logging.
 */

import type { Redis } from 'ioredis';
import { buildRedisClient } from '../infrastructure/connection/redis.factory';

export type RealtimeRedisConnections = {
  cache: Redis;
  publisher?: Redis;
  subscriber?: Redis;
  shutdown: () => Promise<void>;
};

export async function buildRealtimeRedisConnections(
  mode: 'standalone' | 'distributed' | 'disabled'
): Promise<RealtimeRedisConnections> {
  if (mode === 'disabled') {
    return {
      cache: undefined as any,
      shutdown: async () => undefined,
    };
  }

  if (mode === 'standalone') {
    const cache = buildRedisClient('cache');
    return {
      cache,
      shutdown: async () => {
        await cache.quit().catch(() => undefined);
      },
    };
  }

  // distributed — three connections
  const cache = buildRedisClient('cache');
  const publisher = buildRedisClient('publisher');
  const subscriber = buildRedisClient('subscriber');
  return {
    cache,
    publisher,
    subscriber,
    shutdown: async () => {
      await Promise.all([
        cache.quit().catch(() => undefined),
        publisher.quit().catch(() => undefined),
        subscriber.quit().catch(() => undefined),
      ]);
    },
  };
}
