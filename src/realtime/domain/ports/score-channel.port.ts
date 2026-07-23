/**
 * Port: IScoreChannel.
 *
 * Pub/sub backbone for live score events. In standalone mode the channel
 * is in-process (EventEmitter); in distributed mode it is Redis pub/sub.
 *
 * The channel is the integration point that allows multiple Node instances
 * to notify each other of score updates — the registered handler in each
 * instance then forwards the event to its own locally-connected SSE clients.
 */

export type ScoreChannelMessage = {
  matchId: string;
  event: string;
  payload: unknown;
  publishedAt: number; // epoch ms — for ordering / debugging
};

export type ScoreChannelUnsubscribe = () => void;

export interface IScoreChannel {
  /**
   * Publish a message to the channel. Implementations may choose to also
   * deliver to local subscribers synchronously (fast-path).
   */
  publish(message: ScoreChannelMessage): Promise<void>;

  /**
   * Subscribe to messages whose matchId matches the given pattern.
   * The pattern is a literal matchId (or '*' for all matches).
   * Returns an unsubscribe function.
   */
  subscribe(matchId: string, handler: (msg: ScoreChannelMessage) => void): ScoreChannelUnsubscribe;
}
