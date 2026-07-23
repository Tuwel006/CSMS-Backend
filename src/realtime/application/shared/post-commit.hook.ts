/**
 * postCommit — defers execution until the current tick (or transaction) is done.
 *
 * Used by callers that need to publish a realtime event after a DB write
 * commits, so SSE clients never see uncommitted state.
 *
 * Semantics: at-most-once delivery. If the process crashes between the
 * commit and the deferred callback, the event is lost. This is the same
 * guarantee the previous setImmediate-based code provided.
 */

import logger from '../../../utils/logger';

export function postCommit<T>(fn: () => Promise<T>): void {
  setImmediate(() => {
    fn().catch((err: unknown) => {
      logger.error('post-commit hook failed', { err });
    });
  });
}
