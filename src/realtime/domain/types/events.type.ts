/**
 * SSE event names used by the realtime module.
 * Centralized so producers (publishers) and consumers (handlers) cannot drift.
 */

export const SSE_EVENTS = {
  SCORE: 'score',
  HEARTBEAT: 'heartbeat',
  SNAPSHOT: 'snapshot',
} as const;

export type SseEventName = typeof SSE_EVENTS[keyof typeof SSE_EVENTS];
