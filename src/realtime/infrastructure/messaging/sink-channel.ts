/**
 * SinkChannel — no-op IScoreChannel used in disabled mode.
 *
 * Publishes are silently dropped; subscribe returns a no-op unsubscribe.
 * Used in serverless / Vercel deployments where SSE is not supported.
 */

import {
  IScoreChannel,
  ScoreChannelMessage,
  ScoreChannelUnsubscribe,
} from '../../domain/ports/score-channel.port';

export class SinkChannel implements IScoreChannel {
  async publish(_message: ScoreChannelMessage): Promise<void> {
    // intentionally empty
  }

  subscribe(_matchId: string, _handler: (msg: ScoreChannelMessage) => void): ScoreChannelUnsubscribe {
    return () => undefined;
  }
}
