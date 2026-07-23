/**
 * Redis client factory.
 *
 * Returns a new ioredis client for a given purpose (cache / publisher / subscriber).
 * Each role needs its own connection because ioredis locks a client when it
 * enters subscribe mode, so the publisher and subscriber cannot be the same
 * connection.
 */

import Redis, { RedisOptions } from 'ioredis';

export type RedisRole = 'cache' | 'publisher' | 'subscriber';

export type RedisFactoryOptions = {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  tls?: boolean;
};

export function buildRedisClient(role: RedisRole, opts: RedisFactoryOptions = {}): Redis {
  const url = opts.url ?? process.env.REDIS_URL;
  const isLocal = process.env.NODE_ENV === 'development' && !url;

  const baseOptions: RedisOptions = {
    maxRetriesPerRequest: null,
    retryStrategy(times: number): number {
      return Math.min(times * 50, 2000);
    },
  };

  let client: Redis;

  if (url && !isLocal) {
    client = new Redis(url, {
      ...baseOptions,
      tls: opts.tls !== false ? { rejectUnauthorized: false } : undefined,
    });
  } else {
    client = new Redis({
      ...baseOptions,
      host: opts.host ?? process.env.REDIS_HOST ?? '127.0.0.1',
      port: opts.port ?? parseInt(process.env.REDIS_PORT ?? '6379'),
      password: opts.password ?? process.env.REDIS_PASSWORD,
      db: opts.db ?? parseInt(process.env.REDIS_DB ?? '0'),
    });
  }

  client.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log(`📡 Redis (${role}) connected`);
  });
  client.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log(`✅ Redis (${role}) ready`);
  });
  client.on('error', (err: Error) => {
    // eslint-disable-next-line no-console
    console.error(`❌ Redis (${role}) error:`, err.message);
  });

  return client;
}
