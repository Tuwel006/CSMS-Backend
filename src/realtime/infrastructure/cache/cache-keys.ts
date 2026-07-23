/**
 * Cache key patterns.
 *
 * Centralized so the publisher and cache implementations cannot drift.
 */

export const CacheKeys = {
  score: (matchId: string) => `match:${matchId}:score`,
  pubsubChannel: (matchId: string) => `match:${matchId}:score`,
  pubsubPattern: () => 'match:*:score',
} as const;
