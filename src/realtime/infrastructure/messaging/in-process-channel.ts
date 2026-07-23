/**
 * In-process IScoreChannel.
 *
 * Used in standalone mode (single-node). Backed by Node's EventEmitter.
 * Publishes are synchronous to local subscribers.
 */

import { EventEmitter } from 'events';
type WireMessage = import('../../domain/ports/score-channel.port').ScoreChannelMessage;

import {
  IScoreChannel,
  ScoreChannelMessage,
  ScoreChannelUnsubscribe,
} from '../../domain/ports/score-channel.port';

/**
 * Wire format used over the EventEmitter. We box the message so we can type
 * the listener once.
 */
type WireEnvelope = {
  matchId: string;
  message: ScoreChannelMessage;
};

export class InProcessChannel implements IScoreChannel {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    // Many concurrent matches may be live; lift the default ceiling.
    this.emitter.setMaxListeners(0);
  }

  async publish(message: ScoreChannelMessage): Promise<void> {
    // Local fast-path: deliver synchronously to subscribers of this matchId.
    this.emit(message.matchId, message);
  }

  /**
   * Synchronous fire-and-forget publish. Used by RedisPubSubChannel as a
   * local fast-path so the publishing node doesn't have to wait for the
   * Redis round-trip to deliver to its own connected SSE clients.
   */
  publishLocal(message: ScoreChannelMessage): void {
    this.emit(message.matchId, message);
  }

  subscribe(matchId: string, handler: (msg: ScoreChannelMessage) => void): ScoreChannelUnsubscribe {
    const listener = (envelope: WireEnvelope) => {
      if (envelope.matchId === matchId) handler(envelope.message);
    };
    this.emitter.on(matchId, listener);
    return () => {
      this.emitter.off(matchId, listener);
    };
  }

  private emit(matchId: string, message: ScoreChannelMessage): void {
    const envelope: WireEnvelope = { matchId, message };
    this.emitter.emit(matchId, envelope);
  }
}
