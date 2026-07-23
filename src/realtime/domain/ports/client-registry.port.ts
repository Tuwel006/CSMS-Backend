/**
 * Port: IClientRegistry.
 *
 * Tracks per-match subscribers so that score updates can be broadcast
 * to every connected SSE client for that match. The registry is always
 * in-process (SSE clients are local to the Node instance); horizontal
 * scaling is handled by IScoreChannel wiring between instances.
 */

import { LiveScorePayload } from '../entities/live-score.entity';
import { SseEventName } from '../types/events.type';

export interface IScoreClient {
  readonly matchId: string;
  readonly id: string;
  write(event: SseEventName, data: LiveScorePayload | string): boolean;
  writeComment(text: string): boolean;
  close(): void;
  readonly isAlive: boolean;
}

export interface IClientRegistry {
  add(client: IScoreClient): void;
  remove(client: IScoreClient): void;
  list(matchId: string): IScoreClient[];
  count(matchId?: string): number;
  broadcast(matchId: string, event: SseEventName, data: LiveScorePayload | string): void;
}
