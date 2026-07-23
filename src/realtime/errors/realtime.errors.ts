/**
 * Typed errors for the realtime module.
 * Each error exposes a stable `code` for upper layers to map to HTTP responses.
 */

export type RealtimeErrorCode =
  | 'REALTIME_DISABLED'
  | 'SCORE_BUILD_FAILED'
  | 'CHANNEL_PUBLISH_FAILED'
  | 'CHANNEL_SUBSCRIBE_FAILED'
  | 'CACHE_READ_FAILED'
  | 'CACHE_WRITE_FAILED'
  | 'CLIENT_WRITE_FAILED';

export class RealtimeError extends Error {
  public readonly code: RealtimeErrorCode;
  public readonly cause?: unknown;

  constructor(code: RealtimeErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'RealtimeError';
    this.code = code;
    this.cause = cause;
  }

  static disabled(): RealtimeError {
    return new RealtimeError('REALTIME_DISABLED', 'Realtime is disabled in this environment');
  }
}

export class ScoreBuildError extends RealtimeError {
  constructor(message: string, cause?: unknown) {
    super('SCORE_BUILD_FAILED', message, cause);
    this.name = 'ScoreBuildError';
  }
}

export class ChannelPublishError extends RealtimeError {
  constructor(message: string, cause?: unknown) {
    super('CHANNEL_PUBLISH_FAILED', message, cause);
    this.name = 'ChannelPublishError';
  }
}

export class ChannelSubscribeError extends RealtimeError {
  constructor(message: string, cause?: unknown) {
    super('CHANNEL_SUBSCRIBE_FAILED', message, cause);
    this.name = 'ChannelSubscribeError';
  }
}

export class CacheError extends RealtimeError {
  constructor(code: 'CACHE_READ_FAILED' | 'CACHE_WRITE_FAILED', message: string, cause?: unknown) {
    super(code, message, cause);
    this.name = 'CacheError';
  }
}

export class ClientWriteError extends RealtimeError {
  constructor(message: string, cause?: unknown) {
    super('CLIENT_WRITE_FAILED', message, cause);
    this.name = 'ClientWriteError';
  }
}
