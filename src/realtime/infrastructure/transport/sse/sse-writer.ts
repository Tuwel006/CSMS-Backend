/**
 * SSE frame formatter.
 *
 * Centralizes the wire format so producers and consumers agree on the bytes
 * that go on the wire. SSE wire format:
 *
 *   event: <name>\n
 *   data: <payload>\n
 *   id: <id>\n        (optional)
 *   \n                (terminator)
 *
 * Comments (`: text\n\n`) are used for heartbeats and do not dispatch events.
 */

import { SseEventName, SSE_EVENTS } from '../../../domain/types/events.type';

export class SseWriter {
  formatEvent(event: SseEventName, data: string): string {
    return `event: ${event}\ndata: ${data}\n\n`;
  }

  formatSnapshot(data: string): string {
    return this.formatEvent(SSE_EVENTS.SNAPSHOT, data);
  }

  formatScore(data: string): string {
    return this.formatEvent(SSE_EVENTS.SCORE, data);
  }

  formatHeartbeat(): string {
    // Heartbeat is a comment (no `event:` line) so clients do not dispatch it.
    return ': heartbeat\n\n';
  }

  formatRetry(ms: number): string {
    return `retry: ${ms}\n\n`;
  }
}
