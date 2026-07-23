/**
 * Realtime configuration.
 *
 * Driven by environment variables. The composition root reads these once
 * at startup and passes the resulting object to buildRealtimeContainer().
 */

export type RealtimeMode = 'standalone' | 'distributed' | 'disabled';

export type RealtimeConfig = {
  mode: RealtimeMode;
  cacheTtlSeconds: number;
  heartbeatMs: number;
  writeTimeoutMs: number;
  maxBroadcastWorkers: number;
};

function parseInt10(value: string | undefined, fallback: number): number {
  const n = parseInt(value ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function parseMode(value: string | undefined): RealtimeMode {
  if (value === 'distributed' || value === 'disabled' || value === 'standalone') return value;
  return 'standalone';
}

export function loadRealtimeConfig(env: NodeJS.ProcessEnv = process.env): RealtimeConfig {
  return {
    mode: parseMode(env.REALTIME_MODE),
    cacheTtlSeconds: parseInt10(env.REALTIME_CACHE_TTL_SECONDS, 86400),
    heartbeatMs: parseInt10(env.REALTIME_HEARTBEAT_MS, 25_000),
    writeTimeoutMs: parseInt10(env.REALTIME_WRITE_TIMEOUT_MS, 5_000),
    maxBroadcastWorkers: parseInt10(env.REALTIME_MAX_BROADCAST_WORKERS, 4),
  };
}
