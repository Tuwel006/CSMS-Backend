/**
 * Redis pub/sub-backed IScoreChannel.
 *
 * Used in distributed mode (multi-node). Publishes a JSON message to
 * `match:<id>:score`; every subscribed node (including the publisher)
 * receives the message and forwards to its local SSE clients.
 *
 * Internally uses a single subscriber connection shared across all
 * `subscribe()` calls. The publisher connection is independent.
 */

import type { Redis } from 'ioredis';
import {
  IScoreChannel,
  ScoreChannelMessage,
  ScoreChannelUnsubscribe,
} from '../../domain/ports/score-channel.port';
import { CacheKeys } from '../cache/cache-keys';
import { ChannelPublishError, ChannelSubscribeError } from '../../errors/realtime.errors';
import logger from '../../../utils/logger';

export class RedisPubSubChannel implements IScoreChannel {
  private readonly subscriberHandlers = new Map<string, Set<(msg: ScoreChannelMessage) => void>>();
  private subscribedMatches = new Set<string>();
  private readonly messageHandler: (channel: string, raw: string) => void;

  constructor(
    private readonly publisher: Redis,
    private readonly subscriber: Redis,
    private readonly localEmitter?: (msg: ScoreChannelMessage) => void
  ) {
    this.messageHandler = (channel: string, raw: string) => {
      // Decide which matchId this corresponds to.
      const matchId = channel.startsWith('match:') && channel.endsWith(':score')
        ? channel.slice('match:'.length, -':score'.length)
        : channel;
      try {
        const message = JSON.parse(raw) as ScoreChannelMessage;
        const handlers = this.subscriberHandlers.get(matchId);
        if (handlers) {
          for (const h of handlers) {
            try {
              h(message);
            } catch (err) {
              logger.error('Channel handler threw', { err, matchId });
            }
          }
        }
      } catch (err) {
        logger.error('Failed to parse channel message', { err, channel });
      }
    };

    this.subscriber.on('message', this.messageHandler);
  }

  async publish(message: ScoreChannelMessage): Promise<void> {
    const channel = CacheKeys.pubsubChannel(message.matchId);
    try {
      // Bridge to local subscribers synchronously so the local node doesn't
      // have to wait for a Redis round-trip to deliver to its own clients.
      if (this.localEmitter) this.localEmitter(message);
      await this.publisher.publish(channel, JSON.stringify(message));
    } catch (err) {
      throw new ChannelPublishError(`Failed to publish to ${channel}`, err);
    }
  }

  subscribe(matchId: string, handler: (msg: ScoreChannelMessage) => void): ScoreChannelUnsubscribe {
    let set = this.subscriberHandlers.get(matchId);
    if (!set) {
      set = new Set();
      this.subscriberHandlers.set(matchId, set);
    }
    set.add(handler);

    if (!this.subscribedMatches.has(matchId)) {
      this.subscribedMatches.add(matchId);
      this.subscriber
        .subscribe(CacheKeys.pubsubChannel(matchId))
        .catch((err: unknown) => {
          throw new ChannelSubscribeError(`Failed to subscribe to match ${matchId}`, err);
        });
    }

    return () => {
      const current = this.subscriberHandlers.get(matchId);
      if (!current) return;
      current.delete(handler);
      if (current.size === 0) {
        this.subscriberHandlers.delete(matchId);
        this.subscribedMatches.delete(matchId);
        this.subscriber
          .unsubscribe(CacheKeys.pubsubChannel(matchId))
          .catch((err: unknown) => {
            logger.warn('Failed to unsubscribe from channel', { matchId, err });
          });
      }
    };
  }

  /**
   * Tear down all subscribers. Call on shutdown.
   */
  async shutdown(): Promise<void> {
    this.subscriber.off('message', this.messageHandler);
    await this.subscriber.quit().catch(() => undefined);
    await this.publisher.quit().catch(() => undefined);
  }
}
