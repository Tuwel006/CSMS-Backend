/**
 * SSEClient — wraps an Express Response with write/heartbeat/close semantics.
 *
 * Responsibilities:
 *  - Format frames via SseWriter
 *  - Send periodic heartbeat comments to keep the connection alive
 *  - Detect backpressure (res.write returning false) and close the client
 *    if no drain happens within the configured timeout
 *  - Clean up on transport close / error
 */

import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { IScoreClient } from '../../../domain/ports/client-registry.port';
import { LiveScorePayload } from '../../../domain/entities/live-score.entity';
import { SseEventName } from '../../../domain/types/events.type';
import { SseWriter } from './sse-writer';
import logger from '../../../../utils/logger';

export type SseClientOptions = {
  heartbeatMs?: number;
  writeTimeoutMs?: number;
};

export class SSEClient implements IScoreClient {
  public readonly id: string;
  public readonly matchId: string;
  private readonly heartbeatMs: number;
  private readonly writeTimeoutMs: number;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private writeDeadlineTimer: NodeJS.Timeout | null = null;
  private _isAlive = true;
  private messagesSent = 0;
  private lastWriteAt = 0;

  constructor(
    private readonly res: Response,
    private readonly writer: SseWriter,
    private readonly registry: { remove(client: IScoreClient): void },
    matchId: string,
    options: SseClientOptions = {}
  ) {
    this.id = randomUUID();
    this.matchId = matchId;
    this.heartbeatMs = options.heartbeatMs ?? 25_000;
    this.writeTimeoutMs = options.writeTimeoutMs ?? 5_000;

    this.attachTransportListeners();
    this.startHeartbeat();
  }

  get isAlive(): boolean {
    return this._isAlive;
  }

  get stats() {
    return {
      id: this.id,
      matchId: this.matchId,
      messagesSent: this.messagesSent,
      lastWriteAt: this.lastWriteAt,
    };
  }

  write(event: SseEventName, data: LiveScorePayload | string): boolean {
    if (!this._isAlive) return false;
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    const frame = this.writer.formatEvent(event, serialized);
    return this.writeRaw(frame);
  }

  writeComment(text: string): boolean {
    if (!this._isAlive) return false;
    return this.writeRaw(`: ${text}\n\n`);
  }

  close(): void {
    if (!this._isAlive) return;
    this._isAlive = false;
    this.stopHeartbeat();
    this.clearWriteDeadline();
    try {
      this.res.end();
    } catch {
      // Connection already broken; ignore.
    }
    this.registry.remove(this);
  }

  private writeRaw(frame: string): boolean {
    try {
      const ok = this.res.write(frame);
      this.messagesSent++;
      this.lastWriteAt = Date.now();
      if (!ok) {
        this.armWriteDeadline();
      } else {
        this.clearWriteDeadline();
      }
      return ok;
    } catch (err) {
      logger.warn('SSE write failed, closing client', { id: this.id, err });
      this.close();
      return false;
    }
  }

  private armWriteDeadline(): void {
    if (this.writeDeadlineTimer) return;
    this.writeDeadlineTimer = setTimeout(() => {
      logger.warn('SSE backpressure timeout exceeded, closing client', { id: this.id });
      this.close();
    }, this.writeTimeoutMs);
    // Don't keep the process alive forever waiting for backpressure.
    this.writeDeadlineTimer.unref?.();
  }

  private clearWriteDeadline(): void {
    if (this.writeDeadlineTimer) {
      clearTimeout(this.writeDeadlineTimer);
      this.writeDeadlineTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (!this._isAlive) return;
      this.writeRaw(this.writer.formatHeartbeat());
    }, this.heartbeatMs);
    this.heartbeatTimer.unref?.();
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private attachTransportListeners(): void {
    this.res.on('close', () => this.close());
    this.res.on('error', () => this.close());
    this.res.on('drain', () => this.clearWriteDeadline());
  }
}
