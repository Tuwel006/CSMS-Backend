/**
 * Composition root for the realtime module.
 *
 * Builds the entire object graph once and returns it as a single object.
 * Called from src/App.ts at startup. The returned `scoreSSEHandler` is
 * mounted on the router; the publisher and snapshot service are accessed
 * from the rest of the app via getLiveScorePublisher() /
 * getLiveScoreSnapshotService().
 *
 * Per-client channel subscription happens in the SSE handler itself; the
 * container does not need a global channel→registry binding.
 */

import { LiveScorePublisher } from './application/live-score/live-score.publisher';
import { LiveScoreSnapshotService } from './application/live-score/live-score.snapshot.service';
import { InMemoryScoreCache } from './infrastructure/cache/in-memory-score-cache';
import { RedisScoreCache } from './infrastructure/cache/redis-score-cache';
import { InProcessChannel } from './infrastructure/messaging/in-process-channel';
import { RedisPubSubChannel } from './infrastructure/messaging/redis-pubsub-channel';
import { SinkChannel } from './infrastructure/messaging/sink-channel';
import { SseClientRegistry } from './infrastructure/transport/sse/sse-client-registry';
import { SseWriter } from './infrastructure/transport/sse/sse-writer';
import { ScoreSnapshotBuilder } from './infrastructure/persistence/queries/score-snapshot.builder';
import { createScoreSseHandler } from './interfaces/http/score-sse.handler';
import { buildRealtimeRedisConnections } from './config/realtime.env';
import { RealtimeConfig } from './config/realtime.config';
import { IScoreCache } from './domain/ports/score-cache.port';
import { IScoreChannel } from './domain/ports/score-channel.port';
import { IClientRegistry } from './domain/ports/client-registry.port';
import { IScoreSnapshotBuilder } from './domain/ports/score-snapshot.port';

export type RealtimeContainer = {
  config: RealtimeConfig;
  publisher: LiveScorePublisher;
  snapshotService: LiveScoreSnapshotService;
  scoreSSEHandler: ReturnType<typeof createScoreSseHandler>;
  shutdown: () => Promise<void>;
};

export async function buildRealtimeContainer(config: RealtimeConfig): Promise<RealtimeContainer> {
  const writer = new SseWriter();
  const registry: IClientRegistry = new SseClientRegistry();
  const snapshotBuilder: IScoreSnapshotBuilder = new ScoreSnapshotBuilder();

  let cache: IScoreCache;
  let channel: IScoreChannel;
  let shutdownRedis: () => Promise<void> = async () => undefined;

  if (config.mode === 'disabled') {
    cache = new InMemoryScoreCache();
    channel = new SinkChannel();
  } else {
    const redisConns = await buildRealtimeRedisConnections(config.mode);
    shutdownRedis = redisConns.shutdown;

    if (config.mode === 'standalone') {
      cache = new RedisScoreCache(redisConns.cache, { ttlSeconds: config.cacheTtlSeconds });
      channel = new InProcessChannel();
    } else {
      // distributed
      cache = new RedisScoreCache(redisConns.cache, { ttlSeconds: config.cacheTtlSeconds });
      const inProcess = new InProcessChannel();
      channel = new RedisPubSubChannel(
        redisConns.publisher!,
        redisConns.subscriber!,
        (msg) => {
          // Local fast-path: deliver to local in-process subscribers
          // without waiting for the Redis round-trip.
          inProcess.publishLocal(msg);
        }
      );
    }
  }

  const publisher = new LiveScorePublisher({ cache, channel, snapshotBuilder });
  const snapshotService = new LiveScoreSnapshotService({ cache, snapshotBuilder });

  const scoreSSEHandler = createScoreSseHandler({
    snapshotService,
    channel,
    registry,
    writer,
    realtimeMode: config.mode,
    heartbeatMs: config.heartbeatMs,
    writeTimeoutMs: config.writeTimeoutMs,
  });

  return {
    config,
    publisher,
    snapshotService,
    scoreSSEHandler,
    shutdown: async () => {
      await shutdownRedis();
    },
  };
}

let _container: RealtimeContainer | null = null;

export function setRealtimeContainer(container: RealtimeContainer): void {
  _container = container;
}

export function getRealtimeContainer(): RealtimeContainer {
  if (!_container) {
    throw new Error(
      'Realtime container has not been initialized. Call initializeRealtime() at app startup.'
    );
  }
  return _container;
}
