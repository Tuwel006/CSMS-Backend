/**
 * Public API surface of the realtime module.
 *
 * The rest of the application should only import from this file. The
 * internal layer structure (domain/application/infrastructure/interfaces)
 * is an implementation detail.
 */

import { LiveScorePublisher } from './application/live-score/live-score.publisher';
import { LiveScoreSnapshotService } from './application/live-score/live-score.snapshot.service';
import {
  getRealtimeContainer,
  setRealtimeContainer,
  RealtimeContainer,
  buildRealtimeContainer,
} from './realtime.container';
import { loadRealtimeConfig, RealtimeConfig, RealtimeMode } from './config/realtime.config';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

export type { RealtimeConfig, RealtimeMode, RealtimeContainer };
export { loadRealtimeConfig, buildRealtimeContainer, setRealtimeContainer };

/**
 * Initialize the realtime container. Call from src/App.ts at startup.
 */
export async function initializeRealtime(config?: RealtimeConfig): Promise<RealtimeContainer> {
  const cfg = config ?? loadRealtimeConfig();
  const container = await buildRealtimeContainer(cfg);
  setRealtimeContainer(container);
  logger.info('Realtime initialized', { mode: cfg.mode });
  return container;
}

/**
 * Returns the live score publisher. Throws if the realtime container has
 * not been initialized.
 */
export function getLiveScorePublisher(): LiveScorePublisher {
  return getRealtimeContainer().publisher;
}

/**
 * Returns the live score snapshot service. Throws if the realtime container
 * has not been initialized.
 */
export function getLiveScoreSnapshotService(): LiveScoreSnapshotService {
  return getRealtimeContainer().snapshotService;
}

/**
 * Returns the configured SSE handler for the /sse/score/:matchId endpoint.
 */
export function getScoreSseHandler() {
  return getRealtimeContainer().scoreSSEHandler;
}

/**
 * Returns the active realtime mode. Useful for health checks.
 */
export function getRealtimeMode(): RealtimeMode {
  return getRealtimeContainer().config.mode;
}

/**
 * Convenience wrapper for the SSE handler that preserves the original
 * (req, res) => void signature so existing routes work without changes.
 */
export async function scoreSSEHandler(req: Request, res: Response): Promise<void> {
  const handler = getScoreSseHandler();
  return handler(req, res);
}
